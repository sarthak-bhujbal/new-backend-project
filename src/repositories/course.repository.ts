import { Course } from "../models/course.model";
import { paginate } from "../utils/pagination";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/database";

export class CourseRepository {
  async getAllCourses(
    page: number,
    limit: number,
    filters?: Record<string, any>
  ) {
    const result = await paginate(Course, {
      page: Number(page),
      limit: Number(limit),
      filters,
      attributes: [
        "id",
        "title",
        "description",
        "language",
        "created_at",
        "thumbnail_url",
        "level",
        "tags",
      ],
      order: [["created_at", "DESC"]],
    });
    return result;
  }

  async getCourseById(client_id: string, course_id: string) {
    const sql = `
    SELECT jsonb_build_object(
      'id', c.id,
      'title', c.title,
      'description', c.description,
      'language', c.language,
      'thumbnail_url', c.thumbnail_url,
      'tags', c.tags,
      'level', c.level
    ) AS course,
    COALESCE(
      json_agg(
        jsonb_build_object(
          'id', l.id,
          'title', l.title,
          'seq_no', l.seq_no,
          'total_duration', COALESCE((
              SELECT SUM(
                CASE 
                  WHEN s.duration ~ '^[0-9]+$' THEN CAST(s.duration AS INTEGER)
                  WHEN s.duration ~ '^[0-9]{2}:[0-9]{2}:[0-9]{2}$' THEN 
                    EXTRACT(EPOCH FROM s.duration::TIME)::INTEGER
                  ELSE 0
                END
              )
              FROM sections s
              WHERE s.lesson_id = l.id
          ), 0),
          'sections', COALESCE(
            (
              SELECT json_agg(
                  jsonb_build_object(
                    'id', s.id,
                    'title', s.title,
                    'seq_no', s.seq_no,
                    'duration', s.duration,
                    'content_type', s.content_type
                  )
                  ORDER BY s.seq_no NULLS LAST
              )
              FROM sections s
              WHERE s.lesson_id = l.id
            ),
            '[]'::json
          )
        )
        ORDER BY l.seq_no NULLS LAST
      ) FILTER (WHERE l.id IS NOT NULL),
      '[]'::json
    ) AS lessons
  FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
  WHERE c.client_id = :client_id
    AND c.id = :course_id
  GROUP BY c.id, c.title, c.description, c.language, c.thumbnail_url, c.tags, c.level;
  `;

    return await sequelize?.query(sql, {
      replacements: { client_id, course_id },
      type: QueryTypes?.SELECT,
    });
  }

  async createCourse(data: Partial<Course>) {
    return Course.create(data as any);
  }

  async updateCourse(id: string, data: Partial<Course>) {
    const course = await Course.findByPk(id);
    if (!course) return null;
    return course.update(data);
  }

  async deleteCourse(id: string) {
    const course = await Course.findByPk(id);
    if (!course) return null;
    await course.destroy();
    return course;
  }
}