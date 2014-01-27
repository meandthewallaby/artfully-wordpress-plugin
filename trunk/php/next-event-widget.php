<?php
/**
 * Artful.ly Next Events Widget
 *
 * Creates a widget that displays the next upcoming x events
 */

if( !class_exists( 'artfullynexteventswidget' ) ) {
    class artfullynexteventswidget extends WP_Widget {
	function artfullynexteventswidget() {
	    $widget_ops = array('classname' => 'artfullyEvents', 'description' => __('Display the upcoming Artful.ly events!', 'artfullynexteventswidget'));
	    $control_ops = array('id_base' => 'artfullynexteventswidget');
	    $this->WP_Widget('artfullynexteventswidget', $name = __('Artful.ly Next Events Widget', 'artfullynexteventswidget'), $widget_ops, $control_ops);
	}

	function widget( $args, $instance ) {
	    extract($args);
	    $title = apply_filters('widget_title', $instance['title']);
	    $id = $instance['organization_id'];
	    $num_events = $instance['num_events'];
	    wp_enqueue_script( 'next_events_widget', NME_PLUGIN_URL.'/js/artfully-next-events-widget.js', false, false, true);
	    wp_localize_script( 'next_events_widget', 'next_events_widget', 
		array('organizationId' => $id, 'numEvents' => $num_events, 'domId' => '#'.$args['widget_id']) );
	    echo $before_widget;
	    echo ($title) ? $before_title . $title . $after_title : '';
	    echo $after_widget;
	}

	function update( $new_instance, $old_instance ) {
	    error_log(var_export($new_instance, true));
	    error_log(var_export($old_instance, true));
	    // processes widget options to be saved
	    $instance = wp_parse_args($new_instance, $old_instance);
	    return $instance;
	}

	function form( $instance ) {				
	    $defaults = array( 'title' => 'Next Up', 'organization_id' => '0', 'num_events' => '1');
	    $instance = wp_parse_args( (array) $instance, $defaults );
?>
	    <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Widget Title', 'artfullynexteventswidget') ?></label>
	    <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" /></p>
	    <p><label for="<?php echo $this->get_field_id('organization_id'); ?>"><?php _e('Organization ID', 'artfullynexteventswidget') ?></label>
	    <input class="widefat" id="<?php echo $this->get_field_id('organization_id'); ?>" name="<?php echo $this->get_field_name('organization_id'); ?>" type="text" value="<?php echo $instance['organization_id']; ?>" /></p>
	    <p><label for="<?php echo $this->get_field_id('num_events'); ?>"><?php _e('Number of Events to Show', 'artfullynexteventswidget') ?></label>
	    <input class="widefat" id="<?php echo $this->get_field_id('num_events'); ?>" name="<?php echo $this->get_field_name('num_events'); ?>" type="text" value="<?php echo $instance['num_events']; ?>" /></p>
<?php
	}
    }

    add_action('widgets_init', 'art_next_events_load', 90);

    function art_next_events_load() {
	register_widget('artfullynexteventswidget');
    }
}
?>
