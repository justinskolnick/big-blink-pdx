export const iOSSafariInputFix = () => {
  if (navigator.userAgent.includes('iPhone') && navigator.userAgent.includes('Safari')) {
    try {
      const viewport = document.querySelector('meta[name="viewport"]');

      if (viewport) {
        const content = viewport.getAttribute('content')?.split(', ') ?? [];

        content.push('maximum-scale=1');
        viewport.setAttribute('content', content.join(', '));
      }
    } catch (error) {
      console.log(error);
    }
  }
};
