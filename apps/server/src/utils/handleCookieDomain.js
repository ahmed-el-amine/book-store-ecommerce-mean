const defaultOptions = {
  allowSubDomain: false,
};

const handleCookieDomain = (url, { allowSubDomain } = defaultOptions) => {
  try {
    const { hostname } = new URL(url);
    if (!allowSubDomain) return hostname;

    const hostNameArray = hostname.split('.');
    // return hostname if host domain like domain.com
    if (hostNameArray.length < 3) return hostname;
    // handle domain like sub.domain.com
    return '.' + `${hostNameArray[hostNameArray.length - 2]}` + '.' + `${hostNameArray[hostNameArray.length - 1]}`;
  } catch (error) {
    return '';
  }
};

export default handleCookieDomain;
