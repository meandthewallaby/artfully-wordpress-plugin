<?php
/**
 * Artful.ly Next Events Widget
 *
 * Creates a widget that displays the next upcoming x events
 */

if( !class_exists( 'ArtfullyNextEventsWidget' ) ) {
    class ArtfullyNextEventsWidget extends WP_Widget {
	function ArtfullyNextEventsWidget() {
	    $widget_ops = array('classname' => 'artfullyEvents', 'description' => __('Display the upcoming Artful.ly events!', 'ArtfullyNextEventsWidget'));
	    $control_ops = array('id_base' => 'art-next-events-widget');
	    parent::WP_Widget(false, $name = __('Artful.ly', 'ArtfullyNextEventsWidget'), $widget_ops, $control_ops);
	}

	function widget( $args, $instance ) {
	    extract($args);
	    $title = apply_filters('widget_title', $instance['title']);
	    echo $before_widget;
	    echo ($title) ? $before_title . $title . $after_title : '';
	    echo $after_widget;
	}

	function update( $new_instance, $old_instance ) {
	    $instance = $old_instance;

	    $instance['title'] = strip_tags( $new_instance['title'] );
	    $instance['num_events'] = strip_tags($new_instance['num_events']);

	    return $instance;
	}

	function form( $instance ) {				
	    $defaults = array( 'title' => 'Next Up', 'num_events' => '1');
	    $instance = wp_parse_args( (array) $instance, $defaults );
?>
	    <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Widget Title', 'ArtfullyNextEventsWidget') ?></label>
	    <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" /></p>
	    <p><label for="<?php echo $this->get_field_id('num_events'); ?>"><?php _e('Number of Events', 'ArtfullyNextEventsWidget') ?></label>
	    <input class="widefat" id="<?php echo $this->get_field_id('num_events'); ?>" name="<?php echo $this->get_field_name('num_events'); ?>" type="text" value="<?php echo $instance['num_events']; ?>" /></p>
<?php
	}
    }

    add_action('widgets_init', create_function('', 'return register_widget("ArtfullyNextEventsWidget");'));
}
?>
