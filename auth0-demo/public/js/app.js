let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId
    });
  };



window.onload = async () => {
    await configureClient();
    updateUI();

    // NEW - check for the code and state parameters
    /*
    The user has recently initiated the authentication process and is now looking to complete it.
    This second scenario is the one you need to handle. In your window.onload method, 
    check whether the user is authenticated or not, and if the URL query contains both a code and state parameter. 
    This will indicate that an authentication result is present and needs to be parsed. 
    In that scenario, you do so by calling the auth0.handleRedirectCallback() method. 
    This will attempt to exchange the result that the Auth0 backend gave you back for real tokens you can use.
    In addition, the query parameters must be removed from the URL so that if the user refreshes the page, 
    the app does not try to parse the state and code parameters again. 
    This is achieved with the window.history.replaceState method.
    */
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      console.log("gogogogo")
  
      // Process the login state
      await auth0.handleRedirectCallback();
      
      updateUI();
  
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");
    }
};
  
  // NEW
const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();

    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
    
    // NEW - add logic to show/hide gated content after authentication
    if (isAuthenticated) {
      document.getElementById("gated-content").classList.remove("hidden");
  
      document.getElementById(
        "ipt-access-token"
      ).innerHTML = await auth0.getTokenSilently();
  
      document.getElementById("ipt-user-profile").textContent = JSON.stringify(
        await auth0.getUser()
      );
  
    } else {
      document.getElementById("gated-content").classList.add("hidden");
    }
};


const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
};

const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };
