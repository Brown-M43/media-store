//The URIs of the REST endpoint
RAAURI = "https://prod-61.eastus.logic.azure.com/workflows/4c98fa2aba4e49d29cdda65f1d25a4d8/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PtoHGEke85fkYLPZmuEky733Ndr8vMF4MVx_hRzeP1o";
CIAURI = "https://prod-27.eastus.logic.azure.com/workflows/1dbf1225c56a49a3bd5d387b27a9e1d9/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=g0aJnUgRM2Xu-EObT2F0wqQVsmVRZx9lIhHFQUoLxso";

UIUURI0 = "https://prod-49.eastus.logic.azure.com/workflows/68786c4f08184152b63df82e04c86fd0/triggers/manual/paths/invoke/rest/v1/users/"
UIUURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7o17xww6pG98fpHxYqn-5cyhwBrN4SExde3T-AesYaQ"

DIAURI0 = "https://prod-36.eastus.logic.azure.com/workflows/d941c7acad1c4f3a97637f47cef64c24/triggers/manual/paths/invoke/rest/v1/users/";
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HiOV0HuslWVmuY9qX5Vg3gK8ohg-OIf_H9JLwPO9hhw";


//Handlers for button clicks
$(document).ready(function() {

 
  $("#retUsers").click(function(){

      //Run the get asset list function
      getUserList();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewUser();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewUser(){
  
  //Construct JSON Object for new item
  var subObj = {
    Username: $('#Username').val(),
    Password: $('#Password').val(),
    EmailAddress: $('#EmailAddress').val(),
    }

  //Convert to a JSON String
  subObj = JSON.stringify(subObj);


  //Post the JSON string to the endpoint, note the need to set the content type header
  $.post({
    url: CIAURI,
    data: subObj,
    contentType: 'application/json; charset=utf-8'
    }).done(function (response) {
    getUserList();
    });

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getUserList(){

  //Replace the current HTML in that div with a loading message
  $('#UserList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

  //Get the JSON from the RAA API 
  $.getJSON(RAAURI, function( data ) {

    //Create an array to hold all the retrieved assets
    var items = [];
      
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {
    items.push( "Username: " + val["userName"] + "<br/>");
    items.push( "Password: " + val["password"] + "<br/>");
    items.push( "Email Address: " + val["emailAddress"] + "<br/>");
    items.push('<button type="button" id="subNewForm" class="btn btn-danger" onclick="deleteUser('+val["userID"]+')">Delete</button>');
    items.push('<button type="button" id="subNewForm" class="btn btn-primary" onclick="updateUser('+val["userID"]+')">Update</button>' + "<br/>");

    });


    console.log(items)
      //Clear the assetlist div 
      $('#UserList').empty();

      //Append the contents of the items array to the AssetList Div
      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
        }).appendTo( "#UserList" );
    });
}

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteUser(id){

  $.ajax({

    type: "DELETE",
    url: DIAURI0 + id + DIAURI1,
    }).done(function( msg ) {
    getUserList();
    });


}

// Handlers for button clicks
$(document).ready(function() {
  $("#retUsers").click(function() {
      // Run the get user list function
      getUserList();
  });

  // Handler for the update user button
  $("#submitEditUser").click(function() {
      // Execute the update user function
      submitEditUser();
  });
});

// Function to update an existing user
function submitEditUser() {
  // Construct JSON Object for updated item
  var editObj = {
      Password: $('#editPassword').val(),
      EmailAddress: $('#editEmailAddress').val(),
  };

  // Convert to a JSON String
  editObj = JSON.stringify(editObj);

  // Get the user ID
  var id = $('#editUserID').val();

  // Post the JSON string to the endpoint, note the need to set the content type header
  $.ajax({
      url: UIUURI0 + id + UIUURI1,
      type: 'PATCH', // Use PATCH for update
      data: editObj,
      contentType: 'application/json; charset=utf-8',
      success: function(response) {
          // Close the modal
          $('#editUserModal').modal('hide');
          // Refresh the user list
          getUserList();
      },
      error: function(error) {
          // Handle error
          console.error('Error updating user:', error);
      }
  });
}

// Function to open the update user modal
function updateUser(id) {
  // Get user details for the provided ID
  $.getJSON(UIUURI0 + id + UIUURI1, function(data) {
      // Fill the modal input fields with user details
      $('#editUserID').val(id);
      $('#editUsername').val(data.userName);
      $('#editPassword').val(data.password);
      $('#editEmailAddress').val(data.emailAddress);

      // Show the modal
      $('#editUserModal').modal('show');
  });
}

