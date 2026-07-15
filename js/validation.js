/* Form Validation Utilities */

const FormValidator = {
  validateEmail: function (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  validatePhone: function (phone) {
    // Basic phone validation (digits, optional +, space or dash, 7-15 length)
    const re = /^[\d\s+\-()]{7,15}$/;
    return re.test(String(phone).trim());
  },

  validateUrl: function (url) {
    if (!url) return true; // Optional URL field is valid if empty
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  },

  showError: function (inputEl, message) {
    const parent = inputEl.closest('.form-group');
    if (!parent) return;

    inputEl.classList.add('error');
    
    // Check if error message element already exists
    let errorEl = parent.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  clearError: function (inputEl) {
    const parent = inputEl.closest('.form-group');
    if (!parent) return;

    inputEl.classList.remove('error');
    const errorEl = parent.querySelector('.error-message');
    if (errorEl) {
      parent.removeChild(errorEl);
    }
  },

  clearAllErrors: function (formEl) {
    const inputs = formEl.querySelectorAll('.form-control');
    inputs.forEach(input => this.clearError(input));
  },

  validateRequired: function (formEl, requiredFields) {
    let isValid = true;
    this.clearAllErrors(formEl);

    for (const fieldName of requiredFields) {
      const input = formEl.querySelector(`[name="${fieldName}"]`);
      if (!input) continue;

      const val = input.value.trim();
      
      // Empty check
      if (!val) {
        this.showError(input, `${this.formatFieldName(fieldName)} is required.`);
        isValid = false;
        continue;
      }

      // Email check
      if (input.type === 'email' || fieldName.toLowerCase().includes('email')) {
        if (!this.validateEmail(val)) {
          this.showError(input, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      // Phone check
      if (input.type === 'tel' || fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('contact')) {
        if (!this.validatePhone(val)) {
          this.showError(input, 'Please enter a valid phone/contact number.');
          isValid = false;
        }
      }

      // URL check
      if (fieldName.toLowerCase().includes('url') || fieldName.toLowerCase().includes('image')) {
        if (!this.validateUrl(val)) {
          this.showError(input, 'Please enter a valid URL (starting with http:// or https://).');
          isValid = false;
        }
      }
    }

    return isValid;
  },

  formatFieldName: function (name) {
    // Convert camelCase or snake_case or dash-case to Capitalized Words
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }
};

window.FormValidator = FormValidator;
