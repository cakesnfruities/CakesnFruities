class CustomChatbot extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.conversationHistory = [];
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .chat-icon {
          width: 60px;
          height: 60px;
          background-color: #FF46A2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(179, 116, 20, 0.3);
          transition: all 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }

        .chat-icon:hover {
          transform: scale(1.1);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .chat-window.open {
          display: flex;
          animation: slideInUp 0.3s ease-out;
        }

        .chat-header {
          background: linear-gradient(135deg, #B37414, #9a6210);
          color: white;
          padding: 12px 16px;
          border-radius: 20px 20px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .message {
          margin-bottom: 12px;
          animation: fadeIn 0.3s ease-out;
        }

        .assistant-message {
          align-self: flex-start;
        }

        .user-message {
          align-self: flex-end;
        }

        .message-bubble {
          margin: 8px 0;
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 80%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-out;
          word-wrap: break-word;
        }

        .assistant-bubble {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .user-bubble {
          background: #FF46A2;
          color: #000000;
        }

        .quick-replies {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .category-button, .question-button, .action-button {
          border-radius: 16px;
          cursor: pointer;
          padding: 10px 14px;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .category-button {
          border: 2px solid #FF46A2;
          color: #FF46A2;
          background: white;
        }

        .category-button:hover {
          background: #FF46A2;
          color: white;
        }

        .question-button {
          background: #f8fafc;
          color: #374151;
          border: 1px solid #e5e7eb;
          text-align: left;
        }

        .question-button:hover {
          background: #FF46A2;
          color: white;
        }

        .action-button {
          background: #FF46A2;
          color: white;
          border: none;
          font-weight: 600;
        }

        .action-button:hover {
          background: #FF46A2;
        }

        .minimize-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 640px) {
          .chat-window {
            width: 90vw;
            height: 70vh;
            right: 5vw;
          }
        }
      </style>

      <div class="chat-container">
        <div class="chat-icon" id="chatIcon">
          <i data-feather="message-circle" class="text-white w-6 h-6"></i>
        </div>

        <div class="chat-window" id="chatWindow">
          <div class="chat-header">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <i data-feather="user" class="w-4 h-4" style="color:#B37414"></i>
              </div>
              <h3 class="font-bold">Lábálábá Assistant 🍰</h3>
            </div>
            <button class="minimize-btn" id="minimizeBtn">
              <i data-feather="minus"></i>
            </button>
          </div>

          <div class="chat-messages" id="chatMessages"></div>
        </div>
      </div>
    `;

    this.initializeChatbot();
  }

  initializeChatbot() {
    this.faqData = this.getFaqData();
    setTimeout(() => this.setupEventListeners(), 100);
  }

  setupEventListeners() {
    const chatIcon = this.shadowRoot.getElementById('chatIcon');
    const minimizeBtn = this.shadowRoot.getElementById('minimizeBtn');

    chatIcon.addEventListener('click', () => this.toggleChat());
    minimizeBtn.addEventListener('click', () => this.closeChat());
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    chatWindow.classList.add('open');
    this.showWelcomeMessage();
    feather.replace();
  }

  closeChat() {
    this.isOpen = false;
    const chatWindow = this.shadowRoot.getElementById('chatWindow');
    chatWindow.classList.remove('open');
  }

  showWelcomeMessage() {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    this.addMessage('assistant', "Hi there! 👋 I'm the Lábálábá Assistant. How can I make your day sweeter?");
    setTimeout(() => this.showCategories(), 500);
  }

  addMessage(sender, content) {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.innerHTML = `<div class="message-bubble ${sender}-bubble">${content}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  showCategories() {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    const categoriesDiv = document.createElement('div');
    categoriesDiv.className = 'quick-replies';

    const categories = [
      { emoji: '🍰', name: 'Ordering & Payment' },
      { emoji: '🚚', name: 'Pickup & Delivery' },
      { emoji: '⏰', name: 'Timing & Availability' },
      { emoji: '🎂', name: 'Custom Cakes & Designs' },
      { emoji: '👩‍🍳', name: 'Mentorship & Training' },
      { emoji: '🧁', name: 'Product Info' },
      { emoji: '🎁', name: 'Packages & Gifts' },
      { emoji: '🎁', name: 'General Enquiries & Brand Info' }
    ];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-button';
      btn.textContent = `${cat.emoji} ${cat.name}`;
      btn.addEventListener('click', () => this.showQuestions(cat.name));
      categoriesDiv.appendChild(btn);
    });

    chatMessages.appendChild(categoriesDiv);
  }

  showQuestions(categoryName) {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    const old = chatMessages.querySelector('.quick-replies');
    if (old) old.remove();

    const questions = this.faqData[categoryName];
    if (!questions) return;

    const div = document.createElement('div');
    div.className = 'quick-replies';
    questions.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'question-button';
      btn.textContent = q.question;
      btn.addEventListener('click', () => this.showAnswer(q.answer, q.related || []));
      div.appendChild(btn);
    });
    chatMessages.appendChild(div);
  }

  showAnswer(answer, related = []) {
    this.addMessage('assistant', answer);
    setTimeout(() => {
      if (related.length) this.showRelatedQuestions(related);
      else this.showDirectChatOption();
    }, 300);
  }

  showRelatedQuestions(related) {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'quick-replies';
    related.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'question-button';
      btn.textContent = q;
      btn.addEventListener('click', () => {
        const found = this.findAnswer(q);
        if (found) this.showAnswer(found.answer, found.related || []);
      });
      div.appendChild(btn);
    });
    chatMessages.appendChild(div);
    setTimeout(() => this.showDirectChatOption(), 500);
  }

  showDirectChatOption() {
    const chatMessages = this.shadowRoot.getElementById('chatMessages');
    const btn = document.createElement('button');
    btn.className = 'action-button';
    btn.textContent = '💬 Chat directly with Phebian';
    btn.addEventListener('click', () => {
      window.open('https://wa.me/2348072531784', '_blank');
    });
    chatMessages.appendChild(btn);
  }

  findAnswer(qText) {
    for (const cat in this.faqData) {
      for (const q of this.faqData[cat]) {
        if (q.question === qText) return q;
      }
    }
    return null;
  }

  getFaqData() {
    return {
      'Ordering & Payment': [
  {
    question: 'How do I place an order?',
    answer: 'You can place an order directly through our website menu, by sending us a message on WhatsApp (+2348072531784), or via email at iamphebian@gmail.com.',
    related: ['What payment options do you accept?', 'Can I get a quote before ordering?']
  },
  {
    question: 'What payment options do you accept?',
    answer: 'We currently accept bank transfers, USSD payments, and cash or POS payments at pickup locations. For online orders, payment details will be shared during checkout or chat confirmation.',
    related: ['Is my payment secure?', 'Can I pay via POS at pickup?', 'Can I pay on delivery?']
  },
  {
    question: 'Can I make part payments?',
    answer: 'Yes, for large or custom cake orders, we accept a 70% initial payment and the remaining balance upon completion or before delivery.',
    related: ['Can I pay in installments for large orders?', 'Can I get a quote before ordering?']
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Refunds are only processed if an order is cancelled before production begins or if a confirmed error occurs on our part. Once production starts, refunds are not possible.',
    related: ['What’s your cancellation policy?', 'Do you have a return policy?']
  },
  {
    question: 'Can I pay on delivery?',
    answer: 'Pay-on-delivery is only available for certain locations within Abuja and for trusted returning customers. First-time customers are required to make full or part payment before production.',
    related: ['Is my payment secure?', 'Do you accept international payments?']
  },
  {
    question: 'Can I get an invoice or receipt?',
    answer: 'Yes! All completed orders come with an electronic receipt. For corporate or bulk clients, a detailed invoice can be issued upon request.',
    related: ['Do you take bulk or corporate orders?', 'Can I get a quote before ordering?']
  },
  {
    question: 'Do you take bulk or corporate orders?',
    answer: 'Absolutely! We handle bulk, event, and corporate orders for offices, weddings, birthdays, and more. Kindly contact us early to schedule production and delivery.',
    related: ['Can I pay in installments for large orders?', 'Can I make part payments?']
  },
  {
    question: 'Is there a minimum order amount?',
    answer: 'Yes, there is a minimum order value of ₦5,000 for deliveries within Abuja. For pickups, smaller orders may be accepted depending on availability.',
    related: ['Can I get a quote before ordering?', 'What payment options do you accept?']
  },
  {
    question: 'How do I confirm my payment was received?',
    answer: 'Once payment is made, you will receive a confirmation message via WhatsApp or email. You can also send your proof of payment for faster verification.',
    related: ['What happens if I don’t get a payment confirmation?', 'Is my payment secure?']
  },
  {
    question: 'What happens if I don’t get a payment confirmation?',
    answer: 'If you don’t receive confirmation within 2 hours, please message us directly with your payment proof or transaction reference to verify your order status.',
    related: ['How do I confirm my payment was received?']
  },
  {
    question: 'Do you have a return policy?',
    answer: 'Due to the perishable nature of our products, returns are not accepted. However, if there is an issue with your order, please contact us immediately for a resolution.',
    related: ['Do you offer refunds?', 'What’s your cancellation policy?']
  },
  {
    question: 'Can I modify my order after payment?',
    answer: 'Order modifications can only be made within one hour after payment confirmation and before production begins. After that, changes may not be possible.',
    related: ['What’s your cancellation policy?']
  },
  {
    question: 'Is my payment secure?',
    answer: 'Yes! All payment details are handled securely, and we only share verified account or payment links directly from our official channels.',
    related: ['What payment options do you accept?', 'How do I confirm my payment was received?']
  },
  {
    question: 'Do you offer loyalty discounts?',
    answer: 'Yes, we love rewarding returning customers! Frequent buyers get special discounts and exclusive offers through our loyalty program.',
    related: ['Are there promotional offers or coupons?']
  },
  {
    question: 'Are there promotional offers or coupons?',
    answer: 'Yes! From time to time, we run discount campaigns and promotional offers. Follow us on Instagram and Telegram to stay updated.',
    related: ['Do you offer loyalty discounts?']
  },
  {
    question: 'Can I get a quote before ordering?',
    answer: 'Yes, you can request a detailed price quote based on your preferred items, portion size, and packaging needs. Quotes are usually valid for 24 hours.',
    related: ['Can I make part payments?', 'Do you take bulk or corporate orders?']
  },
  {
    question: 'What’s your cancellation policy?',
    answer: 'Orders can be cancelled within one hour after payment. Once production starts, cancellations may attract a 20% deduction fee from your payment.',
    related: ['Do you offer refunds?', 'Can I modify my order after payment?']
  },
  {
    question: 'Can I pay in installments for large orders?',
    answer: 'Yes. For bulk, event, or wedding cake orders, installment options are available. Kindly discuss with us for a personalized payment plan.',
    related: ['Can I make part payments?', 'Do you take bulk or corporate orders?']
  },
  {
    question: 'Do you accept international payments?',
    answer: 'Yes, clients outside Nigeria can make payments via international transfer (PayPal or wire transfer) after confirming details with us on WhatsApp.',
    related: ['Can I pay on delivery?', 'What payment options do you accept?']
  },
  {
    question: 'Can I pay via POS at pickup?',
    answer: 'Yes! POS payment is available for in-person pickups at our location. You can also pay via transfer if preferred.',
    related: ['What payment options do you accept?', 'Can I pay on delivery?']
  }
],

      'Pickup & Delivery': [
  {
    question: 'Do you deliver outside Abuja?',
    answer: 'Currently, we only deliver within Abuja. However, special long-distance deliveries can sometimes be arranged for large or corporate orders with prior notice.',
    related: ['What are your delivery charges?', 'Do you offer pickup for late-night orders?']
  },
  {
    question: 'What are your delivery charges?',
    answer: 'Delivery charges within Abuja typically range between ₦2,000 and ₦6,500 depending on your exact location. The final delivery fee will be confirmed when you place your order.',
    related: ['Can I pick up instead?', 'Do you offer free delivery for large orders?']
  },
  {
    question: 'Can I pick up instead?',
    answer: 'Yes, you can pick up your order directly from our bakery location in Abuja. Once your order is ready, we’ll share pickup instructions and available time slots.',
    related: ['Do you offer pickup for late-night orders?', 'Can I specify a delivery time?']
  },
  {
    question: 'Can I track my delivery?',
    answer: 'Yes, we provide delivery updates via WhatsApp or phone once your order is dispatched. You can also contact us for real-time tracking assistance.',
    related: ['Who handles your deliveries?', 'What happens if my order arrives late?']
  },
  {
    question: 'Do you offer same-day delivery?',
    answer: 'Yes, same-day delivery is available for select products when you order before 10 AM. Custom cakes may require 24–48 hours of preparation time.',
    related: ['Can I specify a delivery time?', 'Can I change my delivery address after ordering?']
  },
  {
    question: 'What if my order arrives late?',
    answer: 'We do our best to deliver on time, but traffic and weather may cause delays. If your order is delayed, we’ll inform you promptly and keep you updated.',
    related: ['Can I track my delivery?', 'Who handles your deliveries?']
  },
  {
    question: 'What if my cake is damaged during delivery?',
    answer: 'We take great care with packaging and handling. If your order arrives damaged, please contact us immediately with photos so we can assist with a replacement or solution.',
    related: ['How are deliveries packaged?', 'Who handles your deliveries?']
  },
  {
    question: 'Can I change my delivery address after ordering?',
    answer: 'You can change your delivery address up to one hour before dispatch. After your order is out for delivery, address changes may not be possible.',
    related: ['Can I specify a delivery time?', 'Do you deliver to hotels or event centers?']
  },
  {
    question: 'Do you deliver to hotels or event centers?',
    answer: 'Yes, we deliver to hotels, event venues, and offices across Abuja. Please ensure you provide the correct address and contact details for smooth delivery.',
    related: ['Can someone else receive my order?', 'Do you do surprise deliveries?']
  },
  {
    question: 'Can I specify a delivery time?',
    answer: 'Yes! You can select a preferred delivery window when placing your order. We’ll do our best to deliver within that time frame.',
    related: ['Do you do surprise deliveries?', 'Can I pick up instead?']
  },
  {
    question: 'Do you do surprise deliveries?',
    answer: 'Yes, we love surprises! You can schedule a surprise cake or gift delivery. We’ll coordinate discreetly to make the moment special.',
    related: ['Can someone else receive my order?', 'Can I specify a delivery time?']
  },
  {
    question: 'Can someone else receive my order?',
    answer: 'Yes, someone else can receive your order as long as we’re notified in advance. We may require verification through your registered phone number.',
    related: ['Do you deliver to hotels or event centers?', 'What happens if I miss my delivery?']
  },
  {
    question: 'How are deliveries packaged?',
    answer: 'All cakes and snacks are securely packaged in firm boxes to prevent damage and maintain freshness. We also use insulation for temperature-sensitive items.',
    related: ['What if my cake is damaged during delivery?', 'Who handles your deliveries?']
  },
  {
    question: 'What happens if I miss my delivery?',
    answer: 'If delivery fails because no one was available to receive it, we’ll reschedule for a small additional fee. Perishable items may need to be remade if not collected promptly at a specified fee.',
    related: ['Can someone else receive my order?', 'Can I change my delivery address after ordering?']
  },
  {
    question: 'Who handles your deliveries?',
    answer: 'We partner with trusted professional logistics services experienced in handling food and fragile items, ensuring safe and timely delivery.',
    related: ['Can I track my delivery?', 'What if my cake is damaged during delivery?']
  },
  {
    question: 'Do you offer free delivery for large orders?',
    answer: 'Yes, orders above ₦150,000 may qualify for free delivery within select Abuja locations. Terms apply and will be discussed during order confirmation.',
    related: ['What are your delivery charges?', 'Do you take bulk or corporate orders?']
  },
  {
    question: 'Can I schedule recurring deliveries?',
    answer: 'Yes! We offer subscription or recurring delivery options for offices, events, and weekly snack plans. Contact us to customize your schedule.',
    related: ['Do you offer pickup for late-night orders?', 'Do you deliver outside Abuja?']
  },
  {
    question: 'Do you offer pickup for late-night orders?',
    answer: 'Pickup after 7 PM may be available for pre-paid or special orders. Please confirm availability in advance as late pickups are handled by schedule.',
    related: ['Can I pick up instead?', 'Can I schedule recurring deliveries?']
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes between 1 to 3 hours within Abuja, depending on location and order size. You’ll receive updates throughout the process.',
    related: ['Can I track my delivery?', 'Can I specify a delivery time?']
  },
  {
    question: 'Can you deliver multiple items to different addresses?',
    answer: 'Yes, but each address will incur a separate delivery fee. You can list the addresses when placing your order, and we’ll coordinate accordingly.',
    related: ['Do you deliver outside Abuja?', 'What are your delivery charges?']
  }
],

'Timing & Availability': [
  {
    question: 'How far in advance should I place an order?',
    answer: 'For standard cakes and pastries, please place your order at least 2–3 days in advance. For custom cakes or large event orders, we recommend 5–7 days notice to ensure perfection.',
    related: ['How long does it take to prepare a cake?', 'How long in advance should I book custom cakes?']
  },
  {
    question: 'How long does it take to prepare a cake?',
    answer: 'Most cakes take 24–48 hours to prepare, depending on size and design. Custom cakes or tiered cakes may require up to 5 days for planning, baking, and decoration.',
    related: ['Do you bake daily?', 'Can I order same-day cakes?']
  },
  {
    question: 'Do you bake daily?',
    answer: 'Yes! We bake fresh every day to ensure you always get soft, moist, and freshly made cakes and pastries.',
    related: ['What are your business hours?', 'How early do you start deliveries?']
  },
  {
    question: 'What are your business hours?',
    answer: 'Our bakery operates from 8:00 AM to 7:00 PM, Monday to Saturday. Orders can be placed online anytime, even outside business hours.',
    related: ['Do you work on Sundays or public holidays?', 'How early do you start deliveries?']
  },
  {
    question: 'Do you work on Sundays or public holidays?',
    answer: 'We’re open on Sundays and public holidays for pre-booked or special orders only. Please schedule ahead so we can prepare in time.',
    related: ['Can I pre-book for holidays?', 'Can I schedule orders for specific times?']
  },
  {
    question: 'Can I order same-day cakes?',
    answer: 'Yes, same-day cakes are available for select designs when you order before 10:00 AM. Custom cakes and large pastries require advance notice.',
    related: ['Do you bake overnight for urgent orders?', 'How long does it take to prepare a cake?']
  },
  {
    question: 'How early do you start deliveries?',
    answer: 'Our delivery team begins dispatching from 8:30 AM daily. Early morning deliveries can be arranged for special events when requested in advance.',
    related: ['Can I specify a delivery time?', 'Do you deliver outside Abuja?']
  },
  {
    question: 'What’s your busiest period of the year?',
    answer: 'Our busiest seasons are around Valentine’s Day, Easter, Christmas, and festive months. We recommend booking well ahead during these peak times.',
    related: ['Can I pre-book for holidays?', 'Do you close during festive seasons?']
  },
  {
    question: 'Can I pre-book for holidays?',
    answer: 'Absolutely! You should pre-book for festive seasons like Christmas, Valentine’s Day, or birthdays. Early booking helps you secure a guaranteed slot.',
    related: ['Can I book my event date months ahead?', 'Do you close during festive seasons?']
  },
  {
    question: 'Can I schedule orders for specific times?',
    answer: 'Yes! You can set a specific delivery or pickup time while placing your order. We’ll do our best to deliver exactly when you need it.',
    related: ['How early do you start deliveries?', 'Can I get reminders for upcoming orders?']
  },
  {
    question: 'How long in advance should I book custom cakes?',
    answer: 'Custom cakes usually require 5–7 days notice to allow enough time for planning, decoration, and delivery arrangements.',
    related: ['How far in advance should I place an order?', 'Do you bake overnight for urgent orders?']
  },
  {
    question: 'Do you bake overnight for urgent orders?',
    answer: 'Yes, we sometimes work overnight for special or urgent orders, especially for weddings and events. Extra charges may apply for express baking.',
    related: ['Can I order same-day cakes?', 'How early do you start deliveries?']
  },
  {
    question: 'Can I book my event date months ahead?',
    answer: 'Yes! You can secure your preferred date months in advance with a small deposit. This guarantees your booking even during peak seasons.',
    related: ['Can I pre-book for holidays?', 'Do you offer reminders for upcoming orders?']
  },
  {
    question: 'Can I get reminders for upcoming orders?',
    answer: 'Yes, we send reminders via WhatsApp or SMS a day before your scheduled pickup or delivery. You can also request additional notifications.',
    related: ['Can I book my event date months ahead?', 'Can I schedule orders for specific times?']
  },
  {
    question: 'Do you close during festive seasons?',
    answer: 'No, Cakesn\'Fruities stays open during major festive periods! However, we may have adjusted working hours. We advise booking early as slots fill up fast.',
    related: ['What’s your busiest period of the year?', 'Can I pre-book for holidays?']
  }
],

'Custom Cakes & Designs': [
  {
    question: 'Can I bring my own design?',
    answer: 'Absolutely! You can share your design idea, photo, or inspiration — and we’ll recreate it with a Cakesn’Fruities touch to make it unique and beautiful.',
    related: ['Can you replicate a design from Pinterest?', 'Can I combine two designs?']
  },
  {
    question: 'Do you make themed cakes?',
    answer: 'Yes, we specialize in themed cakes for birthdays, weddings, baby showers, corporate events, and more. Just tell us your theme, and we’ll bring it to life!',
    related: ['Do you make cartoon or kids’ cakes?', 'Can you match my party color theme?']
  },
  {
    question: 'Can I choose my own flavor or color?',
    answer: 'Of course! You can choose from our flavor list or request a custom flavor or color combination. We love helping you create something that fits your taste and event theme.',
    related: ['Do you offer fondant and whipped cream cakes?', 'Can you match my party color theme?']
  },
  {
    question: 'Do you offer fondant and whipped cream cakes?',
    answer: 'Yes, we do both! You can choose between rich fondant finishes or light, creamy whipped frosting — whichever suits your style and event.',
    related: ['Do you make 3D or sculpted cakes?', 'Do you make wedding or multi-tier cakes?']
  },
  {
    question: 'Do you make 3D or sculpted cakes?',
    answer: 'Definitely! We love creative projects — cars, handbags, cartoon characters, you name it. Our 3D sculpted cakes are perfect for statement celebrations.',
    related: ['Do you make cartoon or kids’ cakes?', 'Do you print edible photos or logos?']
  },
  {
    question: 'Do you print edible photos or logos?',
    answer: 'Yes! We offer edible image printing for logos, photos, and text — perfect for birthdays, corporate events, and brand cakes.',
    related: ['Do you make corporate cakes?', 'Can I bring my own design?']
  },
  {
    question: 'Do you make wedding or multi-tier cakes?',
    answer: 'Yes, wedding cakes are one of our specialties. We create elegant, multi-tier cakes tailored to your theme, color palette, and guest size.',
    related: ['Do you offer cake tasting before events?', 'Can I get a digital cake mock-up before baking?']
  },
  {
    question: 'Can I add edible flowers or fruits?',
    answer: 'Absolutely! We decorate cakes with fresh or edible flowers, berries, and fruits upon request for a natural, classy touch.',
    related: ['Can you match my party color theme?', 'Do you design vegan or eggless cakes?']
  },
  {
    question: 'Do you make cartoon or kids’ cakes?',
    answer: 'Yes, we make fun and colorful cakes for kids — cartoon characters, superheroes, princesses, and more. You can share your child’s favorite theme with us!',
    related: ['Do you make themed cakes?', 'Can I bring my own design?']
  },
  {
    question: 'Can you match my party color theme?',
    answer: 'Yes! Just send us your color palette or inspiration, and we’ll make sure your cake blends perfectly with your decor and event styling.',
    related: ['Can I choose my own flavor or color?', 'Can I add edible flowers or fruits?']
  },
  {
    question: 'Do you offer cake tasting before events?',
    answer: 'Yes, for weddings and large events, we offer cake tasting sessions so you can try different flavors before making your final choice.',
    related: ['Do you make wedding or multi-tier cakes?', 'Can I get a digital cake mock-up before baking?']
  },
  {
    question: 'Can you replicate a design from Pinterest?',
    answer: 'Sure! You can send us a Pinterest or Instagram photo, and we’ll create something similar — often with a personal twist that makes it uniquely yours.',
    related: ['Can I bring my own design?', 'Can I combine two designs?']
  },
  {
    question: 'Can I combine two designs?',
    answer: 'Yes! If you love two cake styles, we can merge them into one cohesive design — blending colors, patterns, or decorations beautifully.',
    related: ['Can I bring my own design?', 'Can I get a digital cake mock-up before baking?']
  },
  {
    question: 'Do you make cupcakes or dessert tables?',
    answer: 'Yes! We make cupcakes, mini cakes, dessert cups, and full dessert tables that match your cake design and theme.',
    related: ['Do you make gender reveal cakes?', 'Do you make themed cakes?']
  },
  {
    question: 'Do you make gender reveal cakes?',
    answer: 'Yes! We make beautiful gender reveal cakes with colored fillings or frosting surprises inside. You can share the reveal color privately if you want it to stay a secret.',
    related: ['Do you make cupcakes or dessert tables?', 'Can I add a special message on my cake?']
  },
  {
    question: 'Can I add a special message on my cake?',
    answer: 'Of course! You can include any message or short note — we’ll print or pipe it neatly on your cake, cupcake toppers, or fondant plaque.',
    related: ['Do you print edible photos or logos?', 'Can you match my party color theme?']
  },
  {
    question: 'Do you design vegan or eggless cakes?',
    answer: 'Yes, we have vegan, eggless, and lactose-free options available. Please mention your preference when ordering so we can bake accordingly.',
    related: ['Can I add edible flowers or fruits?', 'Can I choose my own flavor or color?']
  },
  {
    question: 'Can I order dummy cakes for display?',
    answer: 'Yes, we provide beautifully designed dummy cakes for photoshoots, stage displays, and exhibitions. You can also combine a dummy with a real tier.',
    related: ['Do you make wedding or multi-tier cakes?', 'Can I get a digital cake mock-up before baking?']
  },
  {
    question: 'Can I get a digital cake mock-up before baking?',
    answer: 'Yes, for large or custom cakes, we can provide a digital sketch or sample image of how your cake will look before baking starts.',
    related: ['Do you make wedding or multi-tier cakes?', 'Can I combine two designs?']
  }
],

'Mentorship & Training': [
  {
    question: 'Do you offer training?',
    answer: 'Yes! Cakesn’Fruities offers both beginner and advanced mentorship programs designed to help you master baking, decorating, and even running a successful cake business.',
    related: ['How long does mentorship last?', 'What topics do you cover?']
  },
  {
    question: 'How long does mentorship last?',
    answer: 'Mentorship duration varies depending on the program — typically between 2 to 8 weeks. Each week focuses on specific skills and practical assignments.',
    related: ['Do you offer private one-on-one coaching?', 'Is mentorship free for eBook buyers?']
  },
  {
    question: 'Is mentorship free for eBook buyers?',
    answer: 'Yes! Buyers of our premium eBook receive a free mentorship slot as part of their learning package — it’s our way of helping you put knowledge into action.',
    related: ['What’s the cost of mentorship without the eBook?', 'Can beginners join?']
  },
  {
    question: 'What topics do you cover?',
    answer: 'We cover a wide range of topics — from basic baking techniques, recipe balancing, cake decoration, fondant art, and pastry making to business management and pricing.',
    related: ['Will I learn fondant, pastries, and decoration?', 'Do you teach business management too?']
  },
  {
    question: 'Can beginners join?',
    answer: 'Absolutely! Our mentorship starts from the basics and gradually builds up to advanced techniques. You don’t need any prior experience — just passion and consistency!',
    related: ['Do I need prior baking experience?', 'Is the training online or physical?']
  },
  {
    question: 'Do I need prior baking experience?',
    answer: 'No experience needed! We guide you step-by-step from foundational skills to professional-level baking and decorating.',
    related: ['Can beginners join?', 'Will I get a certificate?']
  },
  {
    question: 'Is the training online or physical?',
    answer: 'We offer both! You can join our online mentorship via Telegram or register for physical sessions in Abuja, depending on availability.',
    related: ['What app do you use for classes?', 'Can I join from outside Nigeria?']
  },
  {
    question: 'What app do you use for classes?',
    answer: 'We mainly use Telegram for live sessions, updates, and resource sharing. For physical classes, location details are shared privately with registered students.',
    related: ['Is the training online or physical?', 'How do I join your Telegram channel?']
  },
  {
    question: 'Will I get a certificate?',
    answer: 'Yes! Upon successful completion of the mentorship, you’ll receive a digital or printed certificate of participation from Cakesn’Fruities.',
    related: ['Do you offer private one-on-one coaching?', 'Can I get internship experience after training?']
  },
  {
    question: 'How often do you share new recipes?',
    answer: 'We share fresh recipes and creative baking hacks every month with our mentees — so your skills always stay current!',
    related: ['Can I ask questions during mentorship?', 'Are lessons recorded?']
  },
  {
    question: 'Can I ask questions during mentorship?',
    answer: 'Of course! You can ask questions in real time during live sessions or drop them in the mentorship group for personalized feedback.',
    related: ['Are lessons recorded?', 'Do you offer private one-on-one coaching?']
  },
  {
    question: 'Are lessons recorded?',
    answer: 'Yes, most lessons are recorded so mentees can revisit the content anytime — perfect if you miss a class or want to revise.',
    related: ['Can I ask questions during mentorship?', 'Can I join from outside Nigeria?']
  },
  {
    question: 'Can I join from outside Nigeria?',
    answer: 'Yes, you can! Our online mentorship is open to international students — all you need is an internet connection and Telegram access.',
    related: ['Is the training online or physical?', 'What app do you use for classes?']
  },
  {
    question: 'What’s the cost of mentorship without the eBook?',
    answer: 'Our mentorship program fee without the eBook is usually shared privately as it may vary based on the session type (online or physical). You can request the current rate anytime.',
    related: ['Is mentorship free for eBook buyers?', 'Do you offer private one-on-one coaching?']
  },
  {
    question: 'Do you offer private one-on-one coaching?',
    answer: 'Yes! For a more personal experience, we offer one-on-one coaching sessions tailored to your learning goals and schedule.',
    related: ['Do you offer training?', 'Can I get internship experience after training?']
  },
  {
    question: 'Do you have alumni success stories?',
    answer: 'Yes, many of our mentees have launched thriving cake businesses, pastry brands, and dessert catering services. We love celebrating their success stories!',
    related: ['Can I get internship experience after training?', 'Will I learn fondant, pastries, and decoration?']
  },
  {
    question: 'Can I get internship experience after training?',
    answer: 'Yes, top-performing mentees may be offered internship slots with Cakesn’Fruities or our partner bakers for real-world experience.',
    related: ['Do you offer private one-on-one coaching?', 'Will I get a certificate?']
  },
  {
    question: 'Will I learn fondant, pastries, and decoration?',
    answer: 'Yes, our training covers a full range — including baking cakes, pastries, fondant art, and decorative techniques.',
    related: ['What topics do you cover?', 'Do you design vegan or eggless cakes?']
  },
  {
    question: 'Do you teach business management too?',
    answer: 'Definitely! We teach pricing, branding, customer service, and how to run a profitable cake business — not just baking.',
    related: ['What topics do you cover?', 'Do you have alumni success stories?']
  },
  {
    question: 'How do I join your Telegram channel?',
    answer: 'Simply click the Telegram link shared after registration, or ask our chatbot for “Join Mentorship” — it will redirect you to the correct channel.',
    related: ['What app do you use for classes?', 'Can beginners join?']
  }
],

'Product Info': [
  {
    question: 'What ingredients do you use?',
    answer: 'We use high-quality, fresh ingredients — including premium flour, butter, sugar, eggs, milk, and natural flavorings. We also use real fruits and chocolate where needed for the best taste.',
    related: ['Are your cakes halal?', 'Are your ingredients locally sourced?']
  },
  {
    question: 'Are your cakes halal?',
    answer: 'Yes, all our cakes are halal. We do not use alcohol or any non-halal ingredients in our standard recipes except for fruit cakes.',
    related: ['Do you use alcohol in your recipes?', 'Are your products safe for kids?']
  },
  {
    question: 'Do your products contain nuts?',
    answer: 'Some of our products may contain nuts or traces of nuts, especially chocolate or fruit-based pastries. Please inform us ahead if you have nut allergies so we can adjust accordingly.',
    related: ['Are your cakes gluten-free?', 'Do you make dairy-free cakes?']
  },
  {
    question: 'Are your cakes gluten-free?',
    answer: 'We currently offer limited gluten-free options on request. If you have gluten intolerance, please let us know before ordering so we can confirm availability.',
    related: ['Do you make dairy-free cakes?', 'Are your pastries handmade or machine-made?']
  },
  {
    question: 'Do you make dairy-free cakes?',
    answer: 'Yes, we can prepare dairy-free cakes on request using plant-based alternatives like coconut milk or almond milk.',
    related: ['Are your cakes gluten-free?', 'Can I request sugar-free options?']
  },
  {
    question: 'Do you use preservatives?',
    answer: 'No, our cakes and pastries are freshly baked without artificial preservatives. We focus on natural freshness and quality.',
    related: ['How long do your pastries last?', 'How do I store my cake properly?']
  },
  {
    question: 'How long do your pastries last?',
    answer: 'Our pastries stay fresh for up to 3–5 days at room temperature and up to a week if refrigerated properly.',
    related: ['How do I store my cake properly?', 'Can I refrigerate or freeze your pastries?']
  },
  {
    question: 'How do I store my cake properly?',
    answer: 'Store your cake in an airtight container at room temperature if it will be consumed within 24 hours. For longer storage, refrigerate it and allow it to sit at room temperature before serving.',
    related: ['Can I refrigerate or freeze your pastries?', 'Can I warm my pastries after a day?']
  },
  {
    question: 'Can I refrigerate or freeze your pastries?',
    answer: 'Yes! Refrigerate pastries for up to 5 days or freeze them for up to 3 weeks. Always wrap them properly to retain moisture.',
    related: ['How do I store my cake properly?', 'Can I warm my pastries after a day?']
  },
  {
    question: 'Do you use alcohol in your recipes?',
    answer: 'No, we do not use alcohol (except in fruit cakes) in our cakes or pastries, except for special custom requests — and we always confirm with the customer first.',
    related: ['Are your cakes halal?', 'Are your products safe for kids?']
  },
  {
    question: 'Are your products safe for kids?',
    answer: 'Yes, our cakes and pastries are 100% safe for children. We avoid alcohol and use food-grade colorings and flavorings.',
    related: ['Do you use food coloring?', 'Do your products contain nuts?']
  },
  {
    question: 'Can I warm my pastries after a day?',
    answer: 'Yes, you can lightly warm most pastries in a microwave for 10–15 seconds or in an oven at low heat to restore freshness.',
    related: ['How do I store my cake properly?', 'Can I refrigerate or freeze your pastries?']
  },
  {
    question: 'Do you use fresh fruits?',
    answer: 'Absolutely! We use fresh, handpicked fruits for our fruit cakes, toppings, and fillings to ensure a natural, juicy flavor.',
    related: ['Are your ingredients locally sourced?', 'Are your pastries handmade or machine-made?']
  },
  {
    question: 'Are your ingredients locally sourced?',
    answer: 'We source many of our ingredients locally from trusted Nigerian suppliers, while some specialty items like chocolate are imported for quality.',
    related: ['What ingredients do you use?', 'Do you use fresh fruits?']
  },
  {
    question: 'Can I get a full ingredient list?',
    answer: 'Yes, we can provide a full ingredient list for any of our cakes or pastries upon request, especially for customers with allergies or dietary restrictions.',
    related: ['Do your products contain nuts?', 'Are your cakes gluten-free?']
  },
  {
    question: 'Are your products vegetarian friendly?',
    answer: 'Yes, most of our cakes are vegetarian friendly since we don’t use animal fat or gelatin. However, we recommend checking with us for special cakes.',
    related: ['Do you make dairy-free cakes?', 'Can I request sugar-free options?']
  },
  {
    question: 'What kind of flour do you use?',
    answer: 'We use high-quality wheat flour for most recipes and can substitute with special flours (like almond or coconut flour) for custom dietary requests.',
    related: ['Are your cakes gluten-free?', 'Do you make dairy-free cakes?']
  },
  {
    question: 'Are your pastries handmade or machine-made?',
    answer: 'All our pastries are handcrafted with care by our team. We use minimal machinery — every detail is made with love and precision!',
    related: ['Do you use fresh fruits?', 'Do you use preservatives?']
  },
  {
    question: 'Do you use food coloring?',
    answer: 'Yes, we use food-safe, approved colorings to achieve vibrant designs. We also offer natural coloring options on request.',
    related: ['Are your products safe for kids?', 'Can I choose my own color?']
  },
  {
    question: 'Can I request sugar-free options?',
    answer: 'Yes, we offer low-sugar and sugar-free cakes on special request — perfect for health-conscious or diabetic customers.',
    related: ['Do you make dairy-free cakes?', 'Are your products vegetarian friendly?']
  }
],

'Packages & Gifts': [
  {
    question: 'What special packages do you offer?',
    answer: 'We offer a range of exciting packages — including birthday boxes, love hampers, festive gift sets, appreciation boxes, and celebration bundles. Each can be customized to suit your theme or budget!',
    related: ['Can I customize my gift box?', 'Do you offer birthday packages?']
  },
  {
    question: 'Can I customize my gift box?',
    answer: 'Absolutely! You can choose your preferred cake size, pastries, colors, and even add extras like drinks, notes, or decor. Every box is tailored to make your recipient feel special.',
    related: ['Can I include personal notes?', 'Can I add chocolates, drinks, or cards?']
  },
  {
    question: 'Do you offer birthday packages?',
    answer: 'Yes, we have special birthday packages that include cakes, cupcakes, pastries, drinks, and optional balloons or cards — all beautifully arranged for delivery or pickup.',
    related: ['Can I choose packaging colors?', 'Do you offer surprise delivery gifts?']
  },
  {
    question: 'Do you make Valentine or Christmas packages?',
    answer: 'Of course! We create themed packages for Valentine’s Day, Christmas, Easter, Mother’s Day, and other holidays. You can pre-order early to secure your slot.',
    related: ['Can I pre-order gifts for later dates?', 'Do you create seasonal hampers?']
  },
  {
    question: 'Can I add chocolates, drinks, or cards?',
    answer: 'Yes, you can include extras like chocolates, wine, soft drinks, or greeting cards in your package. Just tell us what you want added when placing your order.',
    related: ['Can I include flowers or balloons?', 'Can I include personal notes?']
  },
  {
    question: 'Can I include personal notes?',
    answer: 'Yes! You can add a handwritten or printed note to your gift — perfect for birthdays, anniversaries, or surprise deliveries.',
    related: ['Do you offer surprise delivery gifts?', 'Do you wrap gifts professionally?']
  },
  {
    question: 'Do you offer surprise delivery gifts?',
    answer: 'Yes, we specialize in surprise deliveries! We can deliver gifts anonymously or at a set time to create a memorable experience.',
    related: ['Can you deliver gifts anonymously?', 'Can I pre-order gifts for later dates?']
  },
  {
    question: 'Can I pre-order gifts for later dates?',
    answer: 'Definitely! You can schedule your gift delivery days or even weeks ahead — we’ll handle the timing and make sure it’s perfectly executed.',
    related: ['Do you offer surprise delivery gifts?', 'Do you wrap gifts professionally?']
  },
  {
    question: 'Do you wrap gifts professionally?',
    answer: 'Yes, every package is carefully wrapped and styled with ribbons, tags, and custom branding for a premium look.',
    related: ['Can I choose packaging colors?', 'Can I include flowers or balloons?']
  },
  {
    question: 'Can you deliver gifts anonymously?',
    answer: 'Yes, if you want to keep your identity private, we can deliver anonymously — we’ll make sure your surprise stays a secret!',
    related: ['Do you offer surprise delivery gifts?', 'Do you collaborate with event planners?']
  },
  {
    question: 'Do you collaborate with event planners?',
    answer: 'Yes, we often partner with event planners for weddings, birthdays, and corporate functions to create beautiful edible gift setups.',
    related: ['Do you do bulk corporate gifts?', 'Can you help me design a unique gift concept?']
  },
  {
    question: 'Do you do bulk corporate gifts?',
    answer: 'Absolutely! We handle corporate orders and bulk gifting for staff, clients, or festive occasions — complete with branding and custom packaging.',
    related: ['Do you offer discounts for multiple gifts?', 'Can you help me design a unique gift concept?']
  },
  {
    question: 'Can I combine cakes and pastries in one package?',
    answer: 'Yes! You can mix cakes, pastries, snacks, or even drinks in one customized box. It’s a great way to create variety in your gift.',
    related: ['Do you offer snack boxes?', 'Can I choose packaging colors?']
  },
  {
    question: 'Do you offer snack boxes?',
    answer: 'Yes, our snack boxes are perfect for events, offices, and party favors. They come in mini, medium, and deluxe sizes with assorted treats.',
    related: ['What special packages do you offer?', 'Do you offer discounts for multiple gifts?']
  },
  {
    question: 'Can I choose packaging colors?',
    answer: 'Of course! You can select colors that match your event theme or brand — we’ll design the packaging to suit your preference.',
    related: ['Do you wrap gifts professionally?', 'Can I include flowers or balloons?']
  },
  {
    question: 'Can I include flowers or balloons?',
    answer: 'Yes, we can include flowers, balloons, or even custom props to make your gift more festive and personal.',
    related: ['Do you make Valentine or Christmas packages?', 'Do you create seasonal hampers?']
  },
  {
    question: 'Do you create seasonal hampers?',
    answer: 'Yes! We design themed hampers for festive seasons and corporate gifting — such as Christmas, Valentine’s, and Easter specials.',
    related: ['Do you offer birthday packages?', 'Do you offer discounts for multiple gifts?']
  },
  {
    question: 'Do you offer discounts for multiple gifts?',
    answer: 'Yes, we provide discounts on bulk orders or multiple gift packages — perfect for companies, weddings, or family events.',
    related: ['Do you do bulk corporate gifts?', 'Can you help me design a unique gift concept?']
  },
  {
    question: 'Can you help me design a unique gift concept?',
    answer: 'Definitely! Our creative team can help you come up with a one-of-a-kind gift box or event-themed package that perfectly fits your idea.',
    related: ['Do you collaborate with event planners?', 'Do you do bulk corporate gifts?']
  }
],

'General Enquiries & Brand Info': [
  {
    question: 'Where are you located?',
    answer: 'We’re based in Abuja, Nigeria. You can order online, via WhatsApp, or visit us by appointment for pickups and consultations.',
    related: ['Do you deliver nationwide?', 'How can I contact you?']
  },
  {
    question: 'Do you deliver nationwide?',
    answer: 'Yes, we deliver within and outside our city — including nationwide delivery for certain products that travel well (like pastries and gift boxes).',
    related: ['How can I track my order?', 'What areas do you cover for same-day delivery?']
  },
  {
    question: 'How can I contact you?',
    answer: 'You can reach us easily through WhatsApp, Instagram DM, or a phone call. We also respond to messages via our website chat or email.',
    related: ['What are your business hours?', 'Do you respond on weekends?']
  },
  {
    question: 'What’s your brand story?',
    answer: 'Our brand started from a love for creating joy through baking. We blend creativity, quality ingredients, and customer satisfaction into every treat we make!',
    related: ['Who founded the brand?', 'What makes your brand unique?']
  },
  {
    question: 'Who founded the brand?',
    answer: 'Phebian Iyanuoluwa founded the brand with a passion for baking and teaching others. It started small and has now grown into a trusted name for quality and creativity.',
    related: ['What’s your brand story?', 'Do you offer mentorship?']
  },
  {
    question: 'What makes your brand unique?',
    answer: 'We focus on personalized service, fresh ingredients, and creative designs. Whether it’s a custom cake or a simple pastry, everything is made with care and excellence.',
    related: ['Do you use preservatives?', 'Do you bake daily?']
  },
  {
    question: 'Do you collaborate with other brands?',
    answer: 'Yes, we love collaborations! Whether it’s an event, a product launch, or a special promotion, we’re open to creative partnerships.',
    related: ['Do you work with event planners?', 'Can I pitch a collaboration idea?']
  },
  {
    question: 'Can I pitch a collaboration idea?',
    answer: 'Absolutely! You can share your proposal via DM or email. We review every idea and reach out if it’s a good fit for our brand and audience.',
    related: ['Do you collaborate with other brands?', 'Do you offer affiliate partnerships?']
  },
  {
    question: 'Do you offer affiliate partnerships?',
    answer: 'Yes, we occasionally work with affiliates and influencers who love our products. You can reach out to learn about our latest partnership opportunities.',
    related: ['Do you collaborate with other brands?', 'Can I pitch a collaboration idea?']
  },
  {
    question: 'Do you cater for events?',
    answer: 'Yes, we provide catering services for birthdays, weddings, baby showers, and corporate events. From dessert tables to custom cakes, we’ve got you covered!',
    related: ['Can I pre-book for my event?', 'Do you make dessert tables?']
  },
  {
    question: 'Do you have a physical shop?',
    answer: 'We currently operate mainly online with scheduled pickups and deliveries, but you can visit our kitchen or office location by appointment.',
    related: ['Where are you located?', 'Do you plan to open more branches?']
  },
  {
    question: 'Do you plan to open more branches?',
    answer: 'Yes! We’re gradually expanding and plan to open new pickup spots and outlets soon — stay tuned for updates on our social media.',
    related: ['Do you have a physical shop?', 'Where are you located?']
  },
  {
    question: 'Are you on social media?',
    answer: 'Yes! You can find us on Instagram, Facebook, TikTok, and WhatsApp. Follow us to see our latest cakes, offers, and behind-the-scenes moments.',
    related: ['How can I contact you?', 'Do you share baking tips online?']
  },
  {
    question: 'Do you share baking tips online?',
    answer: 'Yes, we regularly share tutorials, recipes, and helpful tips for bakers on our Instagram and Telegram community. You’ll learn something new every week!',
    related: ['Do you offer mentorship?', 'How do I join your Telegram channel?']
  },
  {
    question: 'Are you registered or certified?',
    answer: 'Yes, our business is fully registered and operates under proper hygiene and food safety standards. We take quality and professionalism seriously.',
    related: ['What ingredients do you use?', 'Are your cakes safe for kids?']
  },
  {
    question: 'Do you support causes or charities?',
    answer: 'Yes, we occasionally support community projects, training for youth, and charitable events — especially those centered around empowerment and education.',
    related: ['Do you offer mentorship?', 'Can I collaborate for charity projects?']
  },
  {
    question: 'Can I collaborate for charity projects?',
    answer: 'Definitely! If your event aligns with our values, we’d be happy to discuss possible ways to support. Please send us a short proposal to review.',
    related: ['Do you support causes or charities?', 'Do you collaborate with other brands?']
  },
  {
    question: 'Do you offer refunds or replacements?',
    answer: 'We handle every order with care, but if there’s a valid issue with your order, we’ll gladly replace it or provide a fair resolution. Customer satisfaction comes first.',
    related: ['What payment methods do you accept?', 'Can I cancel an order?']
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, card payments, and mobile transfers. For large events or corporate bookings, we may also accept part-payment plans.',
    related: ['Do you offer refunds or replacements?', 'Can I pay on delivery?']
  },
  {
    question: 'Can I pay on delivery?',
    answer: 'We generally require payment before processing, but for verified repeat customers, we may allow partial payment options for convenience.',
    related: ['What payment methods do you accept?', 'Do you offer discounts for returning customers?']
  },
  {
    question: 'Do you offer discounts for returning customers?',
    answer: 'Yes! We love rewarding loyalty. Returning customers enjoy special discounts, early access to new treats, and exclusive offers during promotions.',
    related: ['Do you offer loyalty rewards?', 'Do you offer referral bonuses?']
  },
  {
    question: 'Do you offer loyalty rewards?',
    answer: 'Yes, we have a loyalty system for frequent buyers — including points, surprise gifts, and early notifications about sales and new products.',
    related: ['Do you offer discounts for returning customers?', 'Do you offer referral bonuses?']
  },
  {
    question: 'Do you offer referral bonuses?',
    answer: 'Yes, if you refer a friend who places an order, you’ll receive a discount or free treat as a thank-you. It’s our way of spreading the sweetness!',
    related: ['Do you offer loyalty rewards?', 'Do you offer discounts for returning customers?']
  },
  {
    question: 'Do you close during festive seasons?',
    answer: 'We stay open during most festive seasons but operate on adjusted hours. However, our slots fill up fast — so early booking is always advised!',
    related: ['What are your business hours?', 'Can I pre-book for holidays?']
  }
]
    };
  }
}

customElements.define('custom-chatbot', CustomChatbot);



