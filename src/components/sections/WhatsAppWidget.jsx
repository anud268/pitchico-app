import React, { useState, useEffect, useRef } from 'react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.8)] hover:scale-110 transition-transform duration-300 animate-[bounce_2s_infinite]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.101.824zM20.015 3.985c-2.195-2.195-5.13-3.411-8.23-3.411-6.435 0-11.667 5.232-11.667 11.667 0 2.059.537 4.067 1.559 5.834L.015 24l6.084-1.595c1.714.939 3.655 1.433 5.659 1.433h.004c6.435 0 11.667-5.232 11.667-11.667 0-3.119-1.215-6.054-3.414-8.253zm-8.22 17.596h-.002c-1.745 0-3.454-.469-4.943-1.353l-.355-.21-3.674.963.981-3.582-.23-.365c-.969-1.536-1.481-3.321-1.481-5.167 0-5.32 4.329-9.65 9.65-9.65 2.579 0 5.004 1.004 6.826 2.827 1.822 1.823 2.826 4.248 2.826 6.828 0 5.32-4.329 9.65-9.65 9.65z"/>
        </svg>
      </button>
    );
  }

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "+919778167652"; // Set your business number here
    const text = "I'd like to ask about an offer from the website.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[280px] h-[360px] sm:h-[450px] sm:w-[360px] md:max-w-[calc(100vw-32px)] bg-[#0b141a] rounded-[1rem] sm:rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] font-sans flex flex-col border border-[#202c33] animate-[fadeInUp_0.3s_ease-out]">
      
      {/* Header - Native WhatsApp Dark Mode */}
      <div className="bg-[#202c33] px-2 py-2 sm:px-3 sm:py-2.5 flex items-center relative z-10 shadow-[0_1px_3px_rgba(11,20,26,0.4)]">
        <div className="pl-1 pr-1.5 sm:pr-2 cursor-pointer hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
          <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] text-[#aebac1]">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </div>
        
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer text-[#aebac1]">
          {/* Default User/Business Avatar Icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 mt-1 sm:mt-2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          {/* <img src="../src/assets/logo.png" alt="Pitchico Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" /> */}
        </div>
        
        <div className="ml-2.5 sm:ml-3 flex-1 overflow-hidden cursor-pointer" onClick={handleWhatsAppRedirect}>
          <h3 className="text-[#e9edef] font-medium text-[13.5px] sm:text-[16px] leading-[18px] sm:leading-[21px] truncate">Pitchico Assistant</h3>
          <p className="text-[#8696a0] text-[11px] sm:text-[13px] leading-[16px] sm:leading-[20px] truncate">online</p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 text-[#aebac1] px-1.5 sm:px-2">
          {/* Video Call Icon */}
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] cursor-pointer"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          {/* Menu Dots */}
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] cursor-pointer"><path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
        </div>
      </div>

      {/* Chat Area - WhatsApp Dark Pattern */}
      <div 
        ref={scrollRef}
        className="relative px-0 py-3 sm:py-4 flex-1 overflow-y-auto w-full flex flex-col"
        style={{
          background: '#0b141a',
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
          backgroundSize: '400px',
          backgroundBlendMode: 'soft-light'
        }}
      >
        <div className="absolute inset-0 bg-[#0b141a]/80 z-0"></div>
        {/* Date Indicator */}
        <div className="flex justify-center mb-4 mt-2 relative z-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-[#182229] px-3.5 py-1.5 rounded-lg text-[#8696a0] text-[12px] font-medium shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] uppercase">
            Today
          </div>
        </div>

        {/* Security Notice */}
        {/* <div className="flex justify-center mb-3 sm:mb-4 px-6 sm:px-8 relative z-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-[#182229] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[#ffeecd] text-[10.5px] sm:text-[12.5px] text-center leading-[15px] sm:leading-[18px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
            <svg viewBox="0 0 10 12" className="inline-block w-[8px] h-[10px] sm:w-[10px] sm:h-[12px] mr-1.5 mb-0.5"><path fill="#ffeecd" d="M5.008 1.455C6.42 1.455 7.56 2.583 7.56 3.98v1.758h.502c.4 0 .725.325.725.725v4.354a.725.725 0 0 1-.725.725H1.932a.725.725 0 0 1-.724-.725V6.463c0-.4.324-.725.724-.725h.508V3.98c0-1.397 1.14-2.525 2.553-2.525zm0 1.258c-.694 0-1.259.57-1.259 1.267v1.758h2.518V3.98c0-.698-.565-1.267-1.259-1.267z"/></svg>
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
          </div>
        </div> */}

        {/* Left Bubble (Received) */}
        <div className="flex mb-[8px] sm:mb-[10px] pl-[8%] relative z-10 pr-[14%] animate-[fadeInLeft_0.3s_ease-out_0.2s_both]">
           <div className="absolute left-[8%] top-0 -ml-[5px] sm:-ml-[7px] w-1.5 h-2.5 sm:w-2 sm:h-3 mt-0 text-[#202c33]">
             <svg viewBox="0 0 8 13" className="w-[6px] h-[10px] sm:w-[8px] sm:h-[13px]">
               <path opacity="1" fill="currentColor" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path>
             </svg>
           </div>
           
           <div className="bg-[#202c33] rounded-[6px] sm:rounded-[7.5px] rounded-tl-none pt-1.5 pb-2 px-2 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative w-full">
             <div className="text-[#e2b5ee] font-medium text-[11.5px] sm:text-[12.5px] leading-[18px] sm:leading-[21px] px-1 pb-0.5 tracking-wide">
               Pitchico Assistant
             </div>
             <p className="text-[#e9edef] text-[13px] sm:text-[14.2px] leading-[17px] sm:leading-[19px] px-1 pb-1 font-[400]">
               👋 Hi there! Welcome to Pitchico! 🎁 Get an Exclusive 50% OFF on your first purchase today!
             </p>
             <div className="flex justify-end mt-[-8px] sm:mt-[-10px] items-center h-[12px] sm:h-[15px] float-right relative top-1 clear-both">
               <span className="text-[#8696a0] text-[9px] sm:text-[11px] whitespace-nowrap pl-3 sm:pl-4">12:35 pm</span>
             </div>
           </div>
        </div>

        {/* Right Bubble (Sent/Drafting) */}
        <div className="flex justify-end col-start-1 col-end-13 mb-[8px] sm:mb-[10px] pr-[8%] relative z-10 pl-[25%] animate-[fadeInUp_0.4s_ease-out_0.6s_both]">
           {/* Wrap bubble logic */}
           <div className="relative w-fit max-w-full">
             <div className="absolute right-[-4px] sm:right-[-7px] top-0 w-1.5 h-2.5 sm:w-2 sm:h-3 text-[#005c4b]">
               <svg viewBox="0 0 8 13" className="w-[6px] h-[10px] sm:w-[8px] sm:h-[13px]">
                 <path opacity="1" fill="currentColor" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
               </svg>
             </div>
             <div className="bg-[#005c4b] rounded-[6px] sm:rounded-[7.5px] rounded-tr-none pt-1.5 pb-2 px-2 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative">
               <p className="text-[#e9edef] text-[13px] sm:text-[14.2px] leading-[17px] sm:leading-[19px] px-1 pb-1 font-[400]">
                 I'd like to ask about an offer from the website.
               </p>
               <div className="flex justify-end mt-[-8px] sm:mt-[-10px] items-center h-[12px] sm:h-[15px] float-right relative top-1 clear-both ml-3 sm:ml-4 gap-1">
                 <span className="text-[#8696a0] text-[9px] sm:text-[11px] whitespace-nowrap pl-2 sm:pl-3 text-right">12:36 pm</span>
                 <svg viewBox="0 0 16 15" className="w-[12px] h-[11px] sm:w-[16px] sm:h-[15px] ml-0.5">
                   {/* Double Check marks (Blue) */}
                   <path fill="#53bdeb" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                 </svg>
               </div>
             </div>
           </div>
        </div>

      </div>

      {/* Footer - WA Chat Input Box perfectly cloned */}
      <div className="bg-[#202c33] px-2 py-2 sm:px-3 sm:py-3 md:py-4 flex items-center gap-1.5 sm:gap-2 relative z-10 w-full">
        <div className="flex-1 bg-[#2a3942] rounded-[24px] px-3 sm:px-4 py-[7.5px] sm:py-[9px] min-h-[36px] sm:min-h-[42px] flex items-center shadow-sm cursor-text" onClick={handleWhatsAppRedirect}>
          {/* Smiley Icon */}
          <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#8696a0] mr-2 sm:mr-3 shrink-0 cursor-pointer"><path fill="currentColor" d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.961-1.44-1.961c-.795 0-1.44.88-1.44 1.961s.645 1.962 1.44 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.13 0-12.13 0zm11.362 1.108s-.67 1.96-5.05 1.96c-3.506 0-5.39-1.165-5.608-1.96 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.61 1.011.978 6.034.978 12.228s4.826 10.761 11.021 10.761S23.02 18.421 23.02 12.228c0-6.194-5.023-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.88 1.439-1.962s-.644-1.961-1.439-1.961c-.795 0-1.44.88-1.44 1.961s.645 1.962 1.44 1.962z"></path></svg>
          <span className="text-[#8696a0] text-[12.5px] sm:text-[15px] flex-1 truncate font-medium">
            Chat Now, It's Free!
          </span>
          {/* Attachment Icon */}
          <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#8696a0] ml-2 sm:ml-3 shrink-0 cursor-pointer"><path fill="currentColor" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
          {/* Camera */}
          <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#8696a0] ml-2 sm:ml-4 shrink-0 cursor-pointer hidden sm:block"><path fill="currentColor" d="M11.832 9.074c-2.31 0-4.183 1.873-4.183 4.183 0 2.31 1.873 4.183 4.183 4.183 2.31 0 4.183-1.873 4.183-4.183 0-2.31-1.873-4.183-4.183-4.183zm0 6.666c-1.371 0-2.483-1.112-2.483-2.483s1.112-2.483 2.483-2.483 2.483 1.112 2.483 2.483-1.112 2.483-2.483 2.483zm6.818-7.398c-.461 0-.835-.374-.835-.835 0-.461.374-.835.835-.835.461 0 .835.374.835.835 0 .461-.374.835-.835.835zm-2.148-1.543l-.707-1.428a1.597 1.597 0 0 0-1.44-.881H9.309c-.615 0-1.177.351-1.44.881l-.707 1.428A1.597 1.597 0 0 1 5.722 7.09H4.155A2.657 2.657 0 0 0 1.5 9.747v9.096A2.657 2.657 0 0 0 4.155 21.5h15.354a2.657 2.657 0 0 0 2.655-2.657V9.747a2.657 2.657 0 0 0-2.655-2.657h-3.007c-.615 0-1.177-.35-1.44-.881L16.502 6.8z"></path></svg>
        </div>
        
        {/* Send Button */}
        <button 
          onClick={handleWhatsAppRedirect}
          className="bg-[#00a884] w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] md:w-[45px] md:h-[45px] rounded-full flex items-center justify-center text-[#111b21] shrink-0 hover:bg-[#008f6f] focus:outline-none transition hover:-translate-y-0.5 shadow-md pl-[3px] sm:pl-1"
        >
          {/* Send Arrow SVG */}
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" ><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
        </button>
      </div>
    </div>
  );
}
