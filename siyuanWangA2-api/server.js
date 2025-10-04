const express = require('express');
const cors = require('cors');
const db = require('./event_db'); // 数据库连接

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/**
 * 1️⃣ 首页事件列表（只显示未过期 & is_active=1 的活动）
 */
app.get('/api/events', (req, res) => {
  const sql = `
    SELECT e.event_id, e.title, e.event_date, e.location, e.ticket_price,
           c.category_name, o.org_name
    FROM charity_events e
    LEFT JOIN event_categories c ON e.category_id = c.category_id
    LEFT JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.is_active = 1 AND e.event_date >= NOW()
    ORDER BY e.event_date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);
  });
});

/**
 * 2️⃣ 活动详情页
 */
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  if (!eventId) {
    return res.status(400).json({ error: "Event ID required" });
  }

  const sql = `
    SELECT e.*, c.category_name, o.org_name, o.contact_email, o.contact_phone, o.website
    FROM charity_events e
    LEFT JOIN event_categories c ON e.category_id = c.category_id
    LEFT JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.event_id = ?
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      res.status(500).send('Database query error');
      return;
    }
    if (results.length === 0) {
      console.warn(`⚠️ Event not found for ID ${eventId}`);
      res.status(404).send('Event not found');
      return;
    }
    res.json(results[0]);
  });
});

/**
 * 3️⃣ 获取所有类别
 */
app.get('/api/categories', (req, res) => {
  const sql = "SELECT * FROM event_categories";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);
  });
});

/**
 * 4️⃣ 搜索活动（支持日期 / 地点 / 类别）
 */
app.get('/api/search', (req, res) => {
  let sql = `
    SELECT e.event_id, e.title, e.event_date, e.location, e.ticket_price,
           c.category_name, o.org_name
    FROM charity_events e
    LEFT JOIN event_categories c ON e.category_id = c.category_id
    LEFT JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.is_active = 1
  `;
  const params = [];

  if (req.query.date) {
    sql += " AND DATE(e.event_date) = ?";
    params.push(req.query.date);
  }
  if (req.query.location) {
    sql += " AND e.location LIKE ?";
    params.push('%' + req.query.location + '%');
  }
  if (req.query.category_id) {
    sql += " AND e.category_id = ?";
    params.push(req.query.category_id);
  }

  sql += " ORDER BY e.event_date ASC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
