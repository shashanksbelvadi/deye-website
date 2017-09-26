// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    getCarouselPhotos(response.authResponse.accessToken);
  } else {
    // The person is not logged into your app or we are unable to tell.
    // document.getElementById('status').innerHTML = 'Please log ' +
    //   'into this app.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1473210229434933',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.10' // use graph api version 2.10
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome! Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '! Here are your Birthday posts:';
  });
}

function getCarouselPhotos(accessToken) {
  var endpoint = '/557236634446086/photos/uploaded';

  FB.api(
    endpoint, {"fields" : ["images", "picture", "album"]},
    function(response) {
      console.log(response);
      if (response && !response.error) {
        setCarouselPhotos(response.data);
      }
    }
  );
}

function setCarouselPhotos(responseData) {
  var imageSizeIndex = 2;

  var randomPhotoList = getFilteredPhotos(responseData);
  console.log(randomPhotoList);

  for (var i = 0; i < randomPhotoList.length; i++) {
    var container = document.getElementById("container");
    var imageURL = randomPhotoList[i].url;
    var imgHeight = randomPhotoList[i].url.height;
    var imgWidth = randomPhotoList[i].url.width;
    var imageDiv = document.getElementById("image" + i);

    imageDiv.setAttribute("src", imageURL);
  }
}

function getFilteredPhotos(responseData) {
  var limit = responseData.length;
  var randomNumList = Array();
  var randomPhotoList = Array();
  var numPhotos = 5;
  var albumName = "Timeline Photos";
  var imageSizeIndex = 2;
  var i = 0;

  while (randomPhotoList.length < numPhotos) {
    var num = Math.floor(Math.random() * limit);

    if (!randomPhotoList.includes(num) && responseData[num].album.name === albumName) {
      var photoObject = {
        "url": responseData[num].images[imageSizeIndex].source,
        "height": responseData[num].images[imageSizeIndex].height,
        "width": responseData[num].images[imageSizeIndex].width,
        "album": responseData[num].album.name
      }

      randomNumList.push(num);
      randomPhotoList.push(photoObject);

      i++;
    }
  }

  return randomPhotoList;
}

function sendRequest(url) {
  var req = new XMLHttpRequest();
  req.open('HEAD', url);
  req.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      console.log(this);
      var image = document.querySelector("#image > img");
      image.setAttribute("src", url);
    }
  };

  req.send();
}
