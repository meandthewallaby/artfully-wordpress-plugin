jQuery(document).ready(function(){
    artfully.configure({
        base_uri: 'https://www.artful.ly/api/v3/',
        store_uri: 'https://www.artful.ly/widget/v3/'
    });
    artfully.widgets.next_events().display(next_events.organizationId, next_events.numEvents);
});
