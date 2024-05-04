
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to get a cookie by name
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

var aff = getParameterByName('aff');

// alert(aff)
if (!getCookie('affiliateID') && aff) {
    // alert('inside cookie set for 30 days')
    setCookie('affiliateID', aff, 30);
    fetch('https://api.ipify.org?format=json')
        .then(results => results.json())
        .then(data => {
            var ip = data.ip;
            var referrer = document.referrer;
            console.log(referrer)
            var refferer_domain = referrer?new URL(referrer).hostname:'direct';
            var pageUrl = window.location.href;
            var userAgent = navigator.userAgent;

            // get all params from URL
            var params = new URLSearchParams(window.location.search);
            var queryParams = {};
            for (var pair of params.entries()) {
                queryParams[pair[0]] = pair[1];
            }
                
            var data = {
                ip: ip,
                referrer: referrer,
                refferer_domain:refferer_domain,
                pageUrl: pageUrl,
                userAgent: userAgent,
                hostName : window.location.hostname,
                ...queryParams
            };

            // transform data to Firestore format
            var transformedData = {};
            for (var keys in data) {
                transformedData[keys] = { stringValue: data[keys] ? data[keys] : '' };
            }

            const firebaseConfig = {
                apiKey: "AIzaSyDHwfzgKXqfknEy3bctrbrlu37_hKeJevo",
                authDomain: "deoapp-indonesia.firebaseapp.com",
                databaseURL: "https://deoapp-indonesia-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "deoapp-indonesia",
                storageBucket: "deoapp-indonesia.appspot.com",
                messagingSenderId: "814589130399",
                appId: "1:814589130399:web:a0bb255936eefd57e554aa",
                measurementId: "G-B9FPJL2RD0"
            };
            
            const projectID = firebaseConfig.projectId;
            const collection = 'affiliate_logs'; // Nama koleksi di Firebase
            const key = firebaseConfig.apiKey;
            const newData={
                createdAt: { timestampValue: new Date() },
                lastUpdated: { timestampValue: new Date() },
            ...transformedData
            }
            

    const url = `https://firestore.googleapis.com/v1/projects/${projectID}/databases/(default)/documents/${collection}?documentId=&key=${key}`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                            },
                body: JSON.stringify({ fields: newData })
            }).then(() => {
                // console.log( await response.json());
                // alert(JSON.stringify(response))
            }).catch(error => {
                console.log(error.message);
                // alert(error.message)
            })
        });
}
else{
    console.log('affiliate=',getCookie('affiliateID'))
}