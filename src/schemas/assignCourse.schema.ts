export const assignCourse = {
  body: {
    type: "object",
    required: ["course_id", "user_id"],
    properties: {
      course_id: {
        type: "array",
        items: { type: "string", format: "uuid" },
        minItems: 1
      },
      user_id: {
        type: "array",
        items: { type: "string", format: "uuid" },
        minItems: 1
      },
    },
    additionalProperties: false
  }
};
