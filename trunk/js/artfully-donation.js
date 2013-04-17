jQuery(document).ready(function(){
    artfully.configure({
        base_uri: 'https://www.artful.ly/api/v3/',
        store_uri: 'https://www.artful.ly/widget/v3/'
    });
	artfully.widgets.cart()
  artfully.widgets.donation().display(artfully_donation.donationId);
  artfully.widgets.cart().display()
});