function registerModels() {
    require("../models/user.model");
    require("../models/role.model");
    require("../models/action.model");
    require("../models/permission.model");
    require("../models/role-permission-action.model");
    require("../models/role-permission.model");
    require("../models/user-address.model");
    require("../models/userMapping.model");
    require("../models/user-preferences.model");
    require("../models/tenant.model");
    require("../models/tenant-configuration.model");
    require("../models/document.model");
    require("../models/topic.model");
    require("../models/opinion.model");
    require("../models/comment.model");
    require("../models/news.model");
    require("../models/subject.model");
    require("../models/reference.model");
    require("../models/question.model");
}

export default registerModels;