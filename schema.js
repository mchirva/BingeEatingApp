var Schema = {
  users: {
    id: {type: 'string', maxlength: 254, nullable: false, primary: true},
    username: {type: 'string', maxlength: 254, nullable: false, unique: true},
    password: {type: 'string', maxlength: 150, nullable: false},
    level: {type: 'int', nullable: false}
  },
  dailysummarysheet: {
    LogId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Time: {type: 'timestamp', nullable: false},
    FoodOrDrinkConsumed: {type: 'string', maxlength: 500, nullable: false},
    Binge: {type: 'integer', nullable: false},
    VomitingOrLaxative: {type: 'integer', nullable: false},
    ContextOrSetting: {type: 'string', maxlength: 50, nullable: false},
    Feelings: {type: 'string', maxlength: 500, nullable: false},
  },
  physicaldailysummary: {
    LogId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Time: {type: 'timestamp', nullable: false},
    PhysicalActivity: {type: 'string', maxlength: 200, nullable: false, primary: true},
    MinutesPerformed: {type: 'integer', nullable: false}
  },
  weeklysummarysheet: {
    LogId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Week: {type: 'integer', nullable: false},
    Binges: {type: 'integer', nullable: false},
    VLD: {type: 'integer', nullable: false},
    FruitVegetableServings: {type: 'integer', nullable: false},
    PhysicalActivity: {type: 'integer', nullable: false},
    Events: {type: 'string', maxlength: 200, nullable: false}
  },
  messages: {
    MessageId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Message: {type: 'string', maxlength: 1000, nullable: false},
    Label: {type: 'string', maxlength: 10, nullable: false}
  },
  appointments: {
    AppointmentId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Username: {type: 'string', maxlength: 50, nullable: false},
    SupporterId: {type: 'string', maxlength: 254, nullable: false},
    AppontmentTime: {type: 'datetime', nullable: false}
  }
};
module.exports = Schema;