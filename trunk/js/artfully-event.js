jQuery(document).ready(function(){
    artfully.configure({
        base_uri: 'https://www.artful.ly/api/',
        store_uri: 'https://www.artful.ly/widget/'
    });
    artfully.widgets.event().display(artfully_event.eventId);
});