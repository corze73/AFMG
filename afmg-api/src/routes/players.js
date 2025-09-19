import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const router = express.Router();

// Middleware to verify JWT token for protected routes
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// GET /api/players - Get all players (public endpoint)
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, position, preferred_foot, current_club, previous_club, 
              image_url, bio, created_at, updated_at 
       FROM players 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/players/:id - Get single player (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, name, position, preferred_foot, current_club, previous_club, 
              image_url, bio, created_at, updated_at 
       FROM players 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/players - Create new player (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, position, preferred_foot, current_club, previous_club, image_url, bio } = req.body;

    // Validate required fields
    if (!name || !position || !preferred_foot) {
      return res.status(400).json({
        success: false,
        message: 'Name, position, and preferred_foot are required'
      });
    }

    // Validate preferred_foot value
    if (!['Left', 'Right', 'Both'].includes(preferred_foot)) {
      return res.status(400).json({
        success: false,
        message: 'preferred_foot must be Left, Right, or Both'
      });
    }

    const result = await query(
      `INSERT INTO players (name, position, preferred_foot, current_club, previous_club, image_url, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, position, preferred_foot, current_club, previous_club, image_url, bio, created_at, updated_at`,
      [name, position, preferred_foot, current_club || null, previous_club || null, image_url || null, bio || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/players/:id - Update player (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, preferred_foot, current_club, previous_club, image_url, bio } = req.body;

    // Check if player exists
    const existingPlayer = await query('SELECT id FROM players WHERE id = $1', [id]);
    
    if (existingPlayer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Validate preferred_foot if provided
    if (preferred_foot && !['Left', 'Right', 'Both'].includes(preferred_foot)) {
      return res.status(400).json({
        success: false,
        message: 'preferred_foot must be Left, Right, or Both'
      });
    }

    const result = await query(
      `UPDATE players 
       SET name = COALESCE($1, name),
           position = COALESCE($2, position),
           preferred_foot = COALESCE($3, preferred_foot),
           current_club = $4,
           previous_club = $5,
           image_url = $6,
           bio = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING id, name, position, preferred_foot, current_club, previous_club, image_url, bio, created_at, updated_at`,
      [name, position, preferred_foot, current_club, previous_club, image_url, bio, id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/players/:id - Delete player (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM players WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;