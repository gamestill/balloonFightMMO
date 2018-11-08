var Social = function (app) {
    function init_soc_goo(cb){
        var $this = this;

 
    }
    function init_soc(cb) {
        var $this = this;
  
    }

    function startGoo($this) {
        if (typeof (gapi) === 'undefined') {
            return;
        }
        gapi.load('auth2', function () {
            auth2 = gapi.auth2.init({
                client_id: '880217176157-4c7va4dmdlau1uov5mh5rdtua2gabs9p.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
            });
            $this.gInit(document.getElementById('btn-google-plus-glo'));
        });
    }
    this.app = app;
    this.gInit = function (element) {

    };
    this.gLogin = function (data) {

    };
    this.socialBtnClick = function () {
        if (window) {
            window.store.set('soc', true);
        }
    }
    this.googleSignIn = function (cre, id, pass) {
        //token
        if (!cre) {
            this.app.
            return;
        }
        if (id && !pass) {
            console.log('sign in:' + id);
        }
        // id n pass
        else if (id && pass) {
            console.log('sign in:' + id + "," + pass);
        }
    };

    this.gSignInFallback = function(){

    };

    this.gBtnClicked = function () {
        if(!window.gloggedin){
            console.log('not logged in');
            return;
        }
        console.log('one tap');
        var $this = this;
        if (!window.gready) {
            this.app.getErrorHand().showError('Google Sign in api not initialized. Please try again later.', Color.DARK);
            return;
        }
        googleyolo.cancelLastOperation().then(function () {
            // Credential selector closed.
            console.log('close g dialog');
        });

        var retrievePromise = googleyolo.retrieve({
            supportedAuthMethods: [
                "https://accounts.google.com",
                "googleyolo://id-and-password"
            ],
            supportedIdTokenProviders: [{
                uri: "https://accounts.google.com",
                clientId: "880217176157-4c7va4dmdlau1uov5mh5rdtua2gabs9p.apps.googleusercontent.com"
            }]
        });
        // The 'googleyolo' object is ready for use.
        retrievePromise.then(function (credential) {
            console.log(JSON.stringify(credential));
            if (credential.password) {
                // An ID (usually email address) and password credential was retrieved.
                // Sign in to your backend using the password.
                $this.googleSignIn(credential, credential.id, credential.password);
                console.log('sign in with email pass');
            } else {
                // A Google Account is retrieved. Since Google supports ID token responses,
                // you can use the token to sign in instead of initiating the Google sign-in
                // flow.
                $this.googleSignIn(credential, credential.idToken);
            }
        }, function (error) {
            // Credentials could not be retrieved. In general, if the user does not
            // need to be signed in to use the page, you can just fail silently; or,
            // you can also examine the error object to handle specific error cases.

            // If retrieval failed because there were no credentials available, and
            // signing in might be useful or is required to proceed from this page,
            // you can call `hint()` to prompt the user to select an account to sign
            // in or sign up with.
            if (error.type === 'noCredentialsAvailable') {
                var hintPromise = googleyolo.hint({
                    supportedAuthMethods: [
                        "https://accounts.google.com"
                    ],
                    supportedIdTokenProviders: [{
                        uri: "https://accounts.google.com",
                        clientId: "880217176157-4c7va4dmdlau1uov5mh5rdtua2gabs9p.apps.googleusercontent.com"
                    }]
                });

                hintPromise.then(function(credential) {
                    if (credential.idToken) {
                        // Send the token to your auth backend.
                        $this.googleSignIn(credential, credential.idToken);
                    }
                }, function(error){
                    $this.gSignInFallback();
                    switch (error.type) {
                        case "userCanceled":
                            // The user closed the hint selector. Depending on the desired UX,
                            // request manual sign up or do nothing.
                            break;
                    case "noCredentialsAvailable":
                            // No hint available for the session. Depending on the desired UX,
                            // request manual sign up or do nothing.
                            break;
                        case "requestFailed":
                            // The request failed, most likely because of a timeout.
                            // You can retry another time if necessary.
                            break;
                        case "operationCanceled":
                            // The operation was programmatically canceled, do nothing.
                            break;
                        case "illegalConcurrentRequest":
                            // Another operation is pending, this one was aborted.
                            break;
                        case "initializationError":
                            // Failed to initialize. Refer to error.message for debugging.
                            break;
                        case "configurationError":
                            // Configuration error. Refer to error.message for debugging.
                            break;
                        default:
                            // Unknown error, do nothing.
                    }
                });

            }
        });
    };

    this.fbBtnClicked = function () {
        this.socialBtnClick();
        var $this = this;
        var logoutText = 'Logout';
        var uid = '';
        FB.login(function (response) {
            console.log('fb res:' + JSON.stringify(response));

            if (response.status === 'connected') {
                uid = response.authResponse.userID;
                FB.api('/me', function (responseO) {
                    FB.api('/me/picture?type=normal', function (responseI) {
                        if ($this.app !== undefined) {
                            var name = responseO.name || 'Unknown Gamer';
                            var url = responseI.data.url;
                            $this.login_Connect(response.authResponse.accessToken, name, uid, url,'fb');
                        }
                    });
                });
            } else if (response.status === 'not_authorized') {
                console.log("not auth");

            } else {
                console.log("not connected");
            }
        }, {
            scope: 'public_profile,email'
        });
    };
    this.fLogin = function (data) {

    };

    this.serverConnectSocial = function (type) {

        this.app.connectSocial(type, token);
    };

    this.gResponseErr = function (data) {
        console.log('google:::: PPP');
    };
    this.gResponse = function (data) {
        console.log('google:::: P1PP');
        this.getSocial().socialBtnClick();
        var name = data.w3.ig || 'Unknown Gamer';
        var url = data.w3.Paa;
        var uid = data.w3.Eea;
        var token = data.Zi.access_token;
  
        console.log(JSON.stringify(data));
        this.getSocial().login_Connect(token,name,uid,url,'goo');
    };
    this.login_Connect = function (token, name, uid, url,type) {
        this.app.GS_fbConnect(token, name, uid, url,type);
    };
 
    this.logOut = function (type, cb) {
        console.log('logout:' + type + "," + gapi);
        if (type === 'fb') {
            console.log('loggoing out db');
            FB.logout(function (res) {
                cb(type, res);
            });
        } else if (type === 'goo' && gapi) {
            var auth2 = gapi.auth2.getAuthInstance();
            console.log(auth2);
            auth2.signOut().then(function () {
                console.log('sign out:' + type);
                cb(type, true);
            });
        }
    };
    this.gSignedIn = function(user){
        if(window.already_conn){
            return;
        }
        window.already_conn = true;
        var pro =  user.getBasicProfile();
        console.log('guser:' + JSON.stringify(user));
        var name = pro.getName() || 'Unknown Gamer';
        var url = pro.getImageUrl();
        var uid = pro.getId();

        this.login_Connect('', name, uid, url,'goo');
    };
    this.fResponse = function (response) {
        var $this = this;
        this.app.isOnline(true);
        var ac_token = "";
        var status = response.status || "";
        var uid = "";
        if (response.authResponse && response.authResponse.accessToken) {
            ac_token = response.authResponse.accessToken;
            uid = response.authResponse.userID;
            if (response.status === 'connected' && !window.already_conn) {
                window.already_conn = true;
                FB.api('/me', function (responseO) {
                    FB.api('/me/picture?type=normal', function (responseI) {
                        var name = responseO.name || 'Unknown Gamer';
                        var url = responseI.data.url;
                        $this.login_Connect(ac_token, name, uid, url,'fb');
                    });

                });
            }

        } else if (response.authResponse === null || response.authResponse === 'null' || response.status == 'unknown') {
            $this.app.failedSocial();
            // console.log('cannot login into fb');
        }
    }
   
    this.init = function (cb) {
        var __soc = window.store.get('soc');
        if (__soc === true || __soc === 'true') {

         //   init_soc(this.fResponse.bind(this));

        } else {
            setTimeout(cb, 5000);
        }
    };

};




module.exports = Social;