class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <!-- ✅ Include Tailwind inside Shadow DOM -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">

      <style>
        :host {
          font-family: 'Poppins', sans-serif;
        }

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #B37414;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #B37414;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .mobile-menu {
          transition: transform 0.3s ease;
        }

        button:focus {
          outline: none;
        }

        .logo-img {
          height: 40px;
          width: 40px;
          object-fit: contain;
          border-radius: 50%;
        }
      </style>

      <nav class="bg-yellow-100 shadow-md fixed w-full top-0 z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <!-- ✅ Logo + Brand Name -->
            <a href="index.html" class="flex items-center space-x-2">
              <img src="images/logo.png" alt="Cakesn'Fruities Logo" class="logo-img">
              <span class="text-2xl font-bold" style="color:#B37414;">Cakesn'Fruities</span>
            </a>

            <!-- Desktop Menu -->
            <div class="hidden md:flex space-x-8">
              <a href="index.html" class="nav-link text-gray-700 font-medium">Home</a>
              <a href="about.html" class="nav-link text-gray-700 font-medium">About</a>
              <a href="menu.html" class="nav-link text-gray-700 font-medium">Menu</a>
              <a href="mentorship.html" class="nav-link text-gray-700 font-medium">Mentorship</a>
              <a href="contact.html" class="nav-link text-gray-700 font-medium">Contact</a>
              <a href="cart.html" class="nav-link text-gray-700 font-medium">Cart</a>
            </div>

            <!-- Mobile Menu Button -->
            <button id="menu-btn" class="md:hidden text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <!-- Mobile Menu -->
          <div id="mobile-menu" class="mobile-menu hidden md:hidden bg-white py-4 border-t">
            <div class="flex flex-col space-y-4 px-4">
              <a href="index.html" class="text-gray-700 font-medium">Home</a>
              <a href="about.html" class="text-gray-700 font-medium">About</a>
              <a href="menu.html" class="text-gray-700 font-medium">Menu</a>
              <a href="mentorship.html" class="text-gray-700 font-medium">Mentorship</a>
              <a href="contact.html" class="text-gray-700 font-medium">Contact</a>
              <a href="cart.html" class="text-gray-700 font-medium">Cart</a>
            </div>
          </div>
        </div>
      </nav>
    `;

    // ✅ Mobile Menu Toggle
    const menuBtn = this.shadowRoot.querySelector('#menu-btn');
    const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');

    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ✅ Define the custom element
customElements.define('custom-navbar', CustomNavbar);

