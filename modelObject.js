module.exports = {

  PushMessage: function (payload) {
    this.expiry = Math.floor(Date.now() / 1000) + 3600; // Default Expiry in 1 hour.
    this.badge = 3;
    this.sound = 'ping.aiff';
    this.alert = "Appointment Reminder!"
    this.payload = payload;
  }

};
