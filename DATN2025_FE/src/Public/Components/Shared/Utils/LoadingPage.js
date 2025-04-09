import $ from 'jquery';
import { useEffect } from 'react';

function LoadingPage() {
    useEffect(() => {
        let layout_loading = $('#layout_loading');
        
        // Show loading when component mounts
        layout_loading.addClass('open');
        
        // Clean up function to hide loading when component unmounts
        return () => {
            layout_loading.removeClass('open');
        };
    }, []);

    return null; // This component doesn't render anything
}

export default LoadingPage
