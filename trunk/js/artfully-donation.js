jQuery(document).ready(function(){
    artfully.configure({
        base_uri: 'https://www.artfullyhq.com/api/',
        store_uri: 'https://www.artfullyhq.com/store/'
    });
  artfully.widgets.donation().display(artfully_donation.donationId);
  artfully.widgets.cart().init()
  artfully.widgets.cart().display()
});