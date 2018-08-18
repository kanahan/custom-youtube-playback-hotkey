document.addEventListener('DOMContentLoaded', function () {
  const btnSave = document.getElementById('btnSave');
  btnSave.addEventListener('click', function () {
    saveSettings();
  });

  const txtIKey = document.getElementById("increaseKey");
  txtIKey.addEventListener('keydown', function (event) {
    if (txtIKey.value.length > 0 && event.keyCode !== 8) {
      event.preventDefault();
    }
  });

  const txtDKey = document.getElementById("decreaseKey");
  txtDKey.addEventListener('keydown', function () {
    if (txtDKey.value.length > 0 && event.keyCode !== 8) {
      event.preventDefault();
    }
  });
});

function saveSettings() {
  const iKey = document.getElementById("increaseKey").value;
  const dKey = document.getElementById("decreaseKey").value;

  if (validateForm(iKey, dKey)) {
    chrome.storage.sync.set({ "youtubeSpeedControl_increaseSpeedKey": iKey });
    chrome.storage.sync.set({ "youtubeSpeedControl_decreaseSpeedKey": dKey });
  }
  else {
    return;
  }

  showMessage(true);
}

function validateForm(increaseKey, decreaseKey) {
  if (increaseKey.length !== 1) {
    showErrorMessage("Increase Speed Key must be more 1 character.")
    return false;
  }

  if (decreaseKey.length !== 1) {
    showErrorMessage("Decrease Speed Key must be more 1 character.")
    return false;
  }
  return true;
}

function showMessage(success) {
  const className = success ? "form-message success" : "form-message failed";
  document.getElementsByClassName("form-message")[0].className = className;
}

function showErrorMessage(message) {
  document.getElementsByClassName("form-message")[0].className = "form-message failed"
  document.getElementById("message").innerHTML = message;
}