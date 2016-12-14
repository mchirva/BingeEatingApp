var Schema = {
  users: {
    UserId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Username: {type: 'string', maxlength: 254, nullable: false, unique: true},
    HashedPassword: {type: 'string', maxlength: 150, nullable: false},
    Salt: {type: 'string', maxlength: 200, nullable: false},
    Role: {type: 'string', maxlength: 50, nullable: false},
    Level: {type: 'int', nullable: false},
    SupporterId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Score: {type: 'int', nullable: false},
    Messages: {type: 'int', nullable: false},
    ImageTagging: {type: 'int', nullable: false},
    CreateDateTime: {type: 'datetime'}
  },
  dailysummarysheet: {
    LogId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Time: {type: 'timestamp', nullable: false},
    FoodOrDrinkConsumed: {type: 'string', maxlength: 500, nullable: false},
    FVNumberOfServings: {type: 'integer', nullable: false},
    Binge: {type: 'integer', nullable: false},
    VomitingOrLaxative: {type: 'integer', nullable: false},
    ContextOrSetting: {type: 'string', maxlength: 50, nullable: false},
    Feelings: {type: 'string', maxlength: 500, nullable: false},
    ImageId: {type: 'string', maxlength: 254, nullable: true},
    ImageTag: {type: 'string', maxlength: 2000, nullable: true}
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
    Weight: {type: 'float', nullable: false},
    Events: {type: 'string', maxlength: 200, nullable: false},
    GoodDays: {type: 'integer', nullable: false},
    CreatedDateTime: {type: 'datetime', nullable: false},
    UpdatedDateTime: {type: 'datetime', nullable: false}
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
  },
  tags: {
    TagId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    Tag: {type: 'string', maxlength: 50, nullable: false}
  },
  images: {
    ImageId: {type: 'string', maxlength: 254, nullable: false, primary: true},
    ImageUrl: {type: 'string', maxlength: 2000, nullable: false}
  },
  imagetags: {
    ImageId: {type: 'string', maxlength: 254, nullable: false},
    TagId: {type: 'string', maxlength: 254, nullable: false}
  },
  question: {
      QuestionId: {type: 'string', maxlength: 254, nullable: false, primary: true},
      Question: {type: 'string', maxlength: 2000, nullable: false},
      Options: {type: 'string', maxlength: 200, nullable: false},
      Answer: {type: 'string', maxlength: 1, nullable: false}
  }
};
module.exports = Schema;