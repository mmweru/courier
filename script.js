function sendMail(e) {
    e.preventDefault(); // Prevent default form submission
    
    const params = {
      pickup: document.getElementById('pickup-location').value,
      delivery: document.getElementById('delivery-location').value,
      details: document.getElementById('package-details').value,
      type: document.getElementById('courier-type').value,
      payment: document.getElementById('payment-option').value
    };
  
    emailjs.send('service_dxo1qa8', 'template_ha6frtq', params)
      .then(() => {
        alert('Email Sent Successfully!');
        document.getElementById('booking-form').reset();
      })
      .catch((error) => {
        console.error('Email Send Error:', error);
        alert('Failed to send email. Please try again.');
      });
  }