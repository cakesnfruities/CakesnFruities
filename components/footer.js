class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <!-- ✅ Load Tailwind inside the Shadow DOM -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">

      <style>
        :host {
          font-family: 'Poppins', sans-serif;
        }

        footer {
          background-color: #FF46A2; /* brand red */
          color: white;
        }

        .social-icon {
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px);
          color: #FF46A2; /* brand red */
        }

        a {
          text-decoration: none;
        }

        a:hover {
          color: #FF46A2;
        }

        .contact-icon {
          color: #FF46A2;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
      </style>

      <footer class="py-12">
        <div class="container mx-auto px-6">
          <div class="grid md:grid-cols-4 gap-8">
            
            <!-- Brand Info -->
            <div class="md:col-span-2">
              <h3 class="text-2xl font-bold mb-4 text-white">Lábálábá</h3>
              <p class="text-gray-100 mb-4 leading-relaxed">
                …sweetening your moments — bringing you homemade pastries, custom cakes, 
                and special celebration packages crafted with excellence and love.
              </p>
              <div class="flex space-x-4">
                <a href="https://wa.me/+2348072531784" target="_blank" class="social-icon text-white">
                  <i data-feather="message-circle"></i>
                </a>
                <a href="https://instagram.com/cakesnfruities_by_phebian" target="_blank" class="social-icon text-white">
                  <i data-feather="instagram"></i>
                </a>
                <a href="https://tiktok.com/@cakesnfruities_by_phoebe" target="_blank" class="social-icon text-white">
                  <i data-feather="video"></i>
                </a>
                <a href="mailto:Iamphebian@gmail.com" class="social-icon text-white">
                  <i data-feather="mail"></i>
                </a>
              </div>
            </div>
            
            <!-- Quick Links -->
            <div>
              <h4 class="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <div class="flex flex-col space-y-2 text-gray-100">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="menu.html">Menu</a>
                <a href="mentorship.html">Mentorship</a>
                <a href="contact.html">Contact</a>
                <a href="cart.html">Cart</a>
              </div>
            </div>
            
            <!-- Contact Info -->
            <div>
              <h4 class="text-lg font-semibold mb-4 text-white">Contact Us</h4>
              <div class="flex flex-col space-y-3 text-gray-100">
                <div class="flex items-center space-x-2">
                  <!-- ✅ WhatsApp/Phone Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="contact-icon" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.744 7.744 0 008.02.001a7.737 7.737 0 00-6.6 11.712L.002 16l4.356-1.396A7.737 7.737 0 0016 8.02a7.71 7.71 0 00-2.399-5.694zm-5.58 11.01a6.57 6.57 0 01-3.347-.918l-.24-.14-2.584.828.843-2.519-.157-.251a6.584 6.584 0 01-.982-3.45 6.595 6.595 0 016.594-6.594 6.56 6.56 0 014.666 1.932A6.573 6.573 0 0114.6 8.02a6.595 6.595 0 01-6.58 6.586zm3.727-4.925c-.203-.1-1.205-.594-1.392-.662-.187-.07-.325-.1-.464.1-.138.203-.532.662-.652.8-.12.138-.24.15-.444.05-.203-.1-.858-.316-1.634-1.01a6.093 6.093 0 01-1.13-1.4c-.12-.203-.013-.313.09-.413.09-.09.203-.24.306-.36.1-.12.137-.203.206-.34.07-.138.035-.258-.015-.358-.05-.1-.464-1.12-.636-1.534-.167-.4-.337-.35-.464-.35h-.395c-.137 0-.357.05-.543.25-.187.203-.712.694-.712 1.686 0 .992.73 1.95.832 2.083.1.138 1.44 2.2 3.494 3.083.49.212.87.34 1.17.44.49.157.936.134 1.287.08.393-.06 1.205-.492 1.375-.967.17-.474.17-.883.12-.966-.05-.083-.186-.132-.39-.233z"/>
                  </svg>
                  <span>+2348072531784</span>
                </div>
                <div class="flex items-center space-x-2">
                  <!-- ✅ WhatsApp/Phone Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="contact-icon" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.744 7.744 0 008.02.001a7.737 7.737 0 00-6.6 11.712L.002 16l4.356-1.396A7.737 7.737 0 0016 8.02a7.71 7.71 0 00-2.399-5.694zm-5.58 11.01a6.57 6.57 0 01-3.347-.918l-.24-.14-2.584.828.843-2.519-.157-.251a6.584 6.584 0 01-.982-3.45 6.595 6.595 0 016.594-6.594 6.56 6.56 0 014.666 1.932A6.573 6.573 0 0114.6 8.02a6.595 6.595 0 01-6.58 6.586zm3.727-4.925c-.203-.1-1.205-.594-1.392-.662-.187-.07-.325-.1-.464.1-.138.203-.532.662-.652.8-.12.138-.24.15-.444.05-.203-.1-.858-.316-1.634-1.01a6.093 6.093 0 01-1.13-1.4c-.12-.203-.013-.313.09-.413.09-.09.203-.24.306-.36.1-.12.137-.203.206-.34.07-.138.035-.258-.015-.358-.05-.1-.464-1.12-.636-1.534-.167-.4-.337-.35-.464-.35h-.395c-.137 0-.357.05-.543.25-.187.203-.712.694-.712 1.686 0 .992.73 1.95.832 2.083.1.138 1.44 2.2 3.494 3.083.49.212.87.34 1.17.44.49.157.936.134 1.287.08.393-.06 1.205-.492 1.375-.967.17-.474.17-.883.12-.966-.05-.083-.186-.132-.39-.233z"/>
                  </svg>
                  <span>+2349061937956 - For Calls</span>
                </div>
                <div class="flex items-center space-x-2">
                  <!-- ✅ Email Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="contact-icon" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v.217l-8 4.8-8-4.8V4zm0 1.383v6.634l5.803-3.482L0 5.383zM6.761 9.674l-6.76 4.056A2 2 0 002 14h12a2 2 0 001.999-1.27l-6.76-4.056L8 10.983l-1.239-.71zM10.197 8.535L16 12.017V5.383l-5.803 3.152z"/>
                  </svg>
                  <span>Iamphebian@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Copyright -->
          <div class="border-t border-red-200 mt-10 pt-6 text-center text-gray-100">
            <p>
              © 2025 Lábálábá. All Rights Reserved.<br>
              Designed & Published by <span class="text-red-100 font-semibold">FJ CodeSprout Academy</span>.
            </p>
          </div>
        </div>
      </footer>
    `;

    // ✅ Initialize Feather icons inside shadow DOM
    const featherScript = document.createElement("script");
    featherScript.src = "https://unpkg.com/feather-icons";
    featherScript.onload = () => {
      if (this.shadowRoot) {
        const feather = window.feather;
        if (feather) feather.replace({}, this.shadowRoot);
      }
    };
    this.shadowRoot.appendChild(featherScript);
  }
}

customElements.define("custom-footer", CustomFooter);




