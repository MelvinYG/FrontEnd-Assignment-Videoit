const Auth = () => {
    const shop = import.meta.env.VITE_SHOPIFY_STORE_URL;
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${import.meta.env.VITE_SHOPIFY_API_KEY}&scope=read_products,write_products,read_orders&redirect_uri=${import.meta.env.VITE_SHOPIFY_REDIRECT_URI}`;
    return (
        <div>
            <h1>Shopify Authentication</h1>
            <a href={authUrl}>Login with Shopify</a>
        </div>
    );
};

export default Auth;
