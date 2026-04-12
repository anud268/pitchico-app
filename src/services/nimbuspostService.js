const axios = require('axios');

const NIMBUSPOST_API_URL = 'https://api.nimbuspost.com/v1';

/**
 * Get NimbusPost Authentication Token
 */
const getAuthToken = async () => {
    try {
        const response = await axios.post(`${NIMBUSPOST_API_URL}/users/login`, {
            email: process.env.NIMBUSPOST_EMAIL,
            password: process.env.NIMBUSPOST_PASSWORD
        });
        if (response.data && response.data.status) {
            return response.data.data; // The token string is directly in data
        } else {
            throw new Error('Failed to get NimbusPost Token: Invalid Credentials');
        }
    } catch (error) {
        console.error('NimbusPost Auth Error:', error.response?.data || error.message);
        throw error;
    }
};

// Product ID to Warehouse Name Mapping
// Add your product IDs and their respective pickup locations here
const pickupMapping = {
    "p1": "test",
    "p2": "test",
    "p3": "test",
    "default": "test"
};

/**
 * Handle Order Split by Pickup Address and Push to Nimbuspost
 */
const createShipment = async (order) => {
    try {
        const token = await getAuthToken();

        const paymentType = order.paymentMethod.toLowerCase().includes('cod') || order.paymentMethod.toLowerCase().includes('cash') 
            ? 'cod' : 'prepaid';

        // 1. Group items by their pickup location
        const shipmentsByWarehouse = {};

        order.items.forEach(item => {
            const warehouseName = pickupMapping[item.productId] || pickupMapping["default"];
            if (!shipmentsByWarehouse[warehouseName]) {
                shipmentsByWarehouse[warehouseName] = {
                    items: [],
                    subtotal: 0
                };
            }
            shipmentsByWarehouse[warehouseName].items.push(item);
            shipmentsByWarehouse[warehouseName].subtotal += (item.price * item.quantity);
        });

        const responses = [];

        // 2. Create a separate shipment for each Warehouse
        for (const [warehouse, data] of Object.entries(shipmentsByWarehouse)) {
            const shipmentPayload = {
                order_number: `${order.orderId}-${warehouse}`, // Unique identifier per split shipment
                shipping_charges: 0,
                discount: 0,
                cod_charges: 0,
                payment_type: paymentType,
                order_amount: order.totalAmount,
                package_weight: 500,
                package_length: 15,
                package_width: 15,
                package_height: 10,
                request_auto_pickup: "no",
                consignee: {
                    name: order.customer.name,
                    address: order.shipping.address,
                    city: order.shipping.city,
                    state: order.shipping.state || "Kerala",
                    pincode: order.shipping.pincode,
                    phone: order.customer.phone.replace(/[^0-9]/g, '')
                },
                // ----------------------------------------------------
                // TO-DO: NINGAL UPDATE CHEYYENDA BHAGAM (PICKUP DETAILS)
                // Nimbuspost-te API format anusharichu pickup details enter cheyyuka.
                // Ithendayalum API dashboard-il ninnu kittunna properties aayirikkanam.
                // ----------------------------------------------------
                pickup: {
                    warehouse_name: warehouse,
                    name: "Pitchico Manager",
                    address: "Pitchico Warehouse",
                    city: "Palakkad",
                    state: "Kerala",
                    pincode: "678622",
                    phone: "9123456789"
                },
                // ----------------------------------------------------
                order_items: data.items.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    price: item.price,
                    sku: item.productId
                }))
            };

            const response = await axios.post(`${NIMBUSPOST_API_URL}/shipments`, shipmentPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data.status) {
                console.error(`NimbusPost Rejected Order for ${warehouse}:`, JSON.stringify(response.data, null, 2));
                responses.push({ warehouse, success: false, error: response.data.message });
            } else {
                console.log(`NimbusPost Shipment Created for ${warehouse}: ${response.data.data.awb_number || 'Success'}`);
                responses.push({ warehouse, success: true, data: response.data.data });
            }
        }

        return responses;

    } catch (error) {
        console.error('NimbusPost Shipment Error:', error.response?.data || error.message);
        // Important: We don't throw the error so that the DB save still succeeds even if Courier tracking fails temporarily
        return { success: false, error: error.message }; 
    }
};

module.exports = {
    createShipment
};
