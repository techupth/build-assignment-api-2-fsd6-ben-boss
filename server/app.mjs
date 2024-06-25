import express from "express";
import connectionPool from "./utils/db.mjs";
import bodyParser from "body-parser";

const app = express();
const port = 4001;

app.use(bodyParser.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments", async (req, res) => {
  let resluts;

  const assignment = req.query.assignment;
  const length = req.query.length

  try {
    resluts = await connectionPool.query(
      `
      select * from posts
      where
        (assignment = $1 or $1 is null or $1 = '')
        and
        (length = $2 or $2 is null or $2 = '');
      `,
      [assignment, length]
    );
  } catch {
    return res.status(500).json({
       "message": "Server could not read assignment because database connection"
    })
  }
  return res.status(200).json({
    "data": resluts.rows
  })
});

app.get("/assignments/:assignmentId", async (req, res) => {
  let resluts;

  const assignmentId = req.query.assignment;

  if (!assignmentId) {
    return res.status(500).json({
      "message": "Server could not read assignment because database connection"
    });
  }

  try {
    resluts = await connectionPool.query(
      `
      select * from posts
      where
        (assignment = $1 or $1 is null or $1 = '')
      `,
      [assignmentId]
    );
  } catch {
    return res.status(404).json({
      "message": "Server could not find a requested assignment"
    })
  }
  return res.status(200).json({
    "data": resluts.rows
  })
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const { title, content, category } = req.body;

  if(!assignmentId || !title || !content || !category) {
    return res.status(404).json({
      "message": "Server could not find a requested assignment to update" 
    });
  }

  try {
    const result = await connectionPool.query(
      `
      UPDATE posts
      SET title = $1, content = $2, due_date = $3
      WHERE assignment = $4
      RETURNING *;
      `,
      [title, content, dueDate, assignmentId]
    );
    return res.status(200).json({
      "message": "Updated assignment successfully",
      "data": result.rows[0]
    });
  } catch {
      return res.status(500).json({
        "message": "Server could not update assignment because database connection"
      })
    }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentId = req.params.assignmentId;
  try {
    const result = await connectionPool.query(
      `
      DELETE FROM posts
      WHERE assignment = $1
      RETURNING *;
      `,
      [assignmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        "message": "Server could not find a requested assignment to delete"
      })
    }
    return res.status(200).json({
      "message": "Updated assignment successfully",
      "data": result.rows[0]
    });
  } catch {
    return res.status(500).json({
      "message": "Server could not update assignment because database connection"
    })
  }
})


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
