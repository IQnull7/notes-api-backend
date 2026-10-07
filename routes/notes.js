const express = require('express');
const pool = require('../db/pool');

const router = express.Router();
const {authenticate} = require('../middleware/auth')
const {validateCreateNote, validatePatchNote} = require('../middleware/validation');


router.get('/', authenticate, async (req, res, next) => {
    const user_id = req.user.userId
    const search = req.query.search

    let limit = req.query.limit
    let page = req.query.page
    let page_no = 1, lim = 5
    
    if(page !== undefined){
        page_no = Number(page)
        if(!Number.isInteger(page_no) || page_no < 1){
            return res.status(400).json({
                message: "Page must be a positive number."
            })
        }
    }
    if(limit !== undefined){
        lim = Number(limit)
        if(!Number.isInteger(lim) || lim < 1){
            return res.status(400).json({
                message: "Limit must be a positive number."
            })
        }
    }

    const offset = (page_no - 1) * lim
    try{

        if(search === undefined){
            const result = await pool.query("Select * from notes where user_id = $1 order by id desc limit $2 offset $3", [user_id, lim, offset]);
            if(result.rows.length === 0){
                return res.status(200).json({
                    message: "You do not have any notes.",
                    data: result.rows
                });
            }
            return res.json({
                message: "Notes fetched successfully",
                data: result.rows
            })
        }

        const result = await pool.query("Select * from notes where user_id = $1 and (title ilike $2 or content ilike $2) order by id desc limit $3 offset $4", [user_id, `%${search}%`, lim, offset]);
        if(result.rows.length === 0){
            return res.status(200).json({
                message: "You do not have any notes.",
                data: result.rows
            });
        }
        return res.json({
            message: "Notes fetched successfully.",
            data: result.rows
        })
    }catch(error){
        next(error);
    }
});

router.get('/:id', authenticate, async (req, res, next) => {
    const id = req.params.id;
    const user_id = req.user.userId
    try{
        const result = await pool.query("Select * from notes where id = $1 and user_id = $2", [id, user_id]);
        if(result.rowCount === 0){
            return res.status(404).json({
                error: "You do not have any notes with this ID."
            });
        }
        return res.json({
            message: "Note fetched successfully",
            data: result.rows[0]
        });
    }catch(error){
        next(error);
    }
});

router.post('/', authenticate, validateCreateNote, async (req, res, next) => {
    const {title, content} = req.body;
    const user_id = req.user.userId
    try{
        const result = await pool.query(
            'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *', [title, content, user_id]
        );
        return res.status(201).json({
            message: "Notes created successfully",
            data: result.rows[0]
        });
    }catch(error){
        next(error);
    }
});

router.put('/:id', authenticate, validateCreateNote, async (req, res, next) => {
    const id = req.params.id;
    const user_id = req.user.userId
    const {title, content} = req.body;
    try{
        const result = await pool.query(
            "UPDATE notes SET title = $1, content = $2 WHERE id = $3 and user_id = $4 RETURNING *", [title, content, id, user_id]
        );
        if(result.rowCount === 0){
            return res.status(404).json({
                message: "Note not found."
            });
        }
        return res.json({
            message: "Note completely updated successfully.",
            data: result.rows[0]
        });
    }catch(error){
        next(error);
    }

});

router.patch('/:id', authenticate, validatePatchNote, async (req, res, next) => {
    const id = req.params.id;
    const {title, content} = req.body;
    const user_id = req.user.userId
    try{
        let result;
        if(title !== undefined && content !== undefined){
            result = await pool.query(
                "UPDATE notes SET title = $1, content = $2 WHERE id = $3 and user_id = $4 RETURNING *", [title, content, id, user_id]
            );
        }
        else if(content !== undefined){
            result = await pool.query(
                "UPDATE notes SET content = $1 WHERE id = $2 and user_id = $3 RETURNING *", [content, id, user_id]
            );
            
        }else if(title !== undefined){
            result = await pool.query(
                "UPDATE notes SET title = $1 WHERE id = $2 and user_id = $3 RETURNING *", [title, id, user_id]
            );
        }
        if(result.rowCount === 0){
            return res.status(404).json({
                message: "Note not found."
            });
        }
        return res.status(200).json({
            message: "Note patched successfully.",
            data: result.rows[0]
        });
        
    }catch(error){
        next(error);
    }

});

router.delete('/:id', authenticate, async(req, res, next) =>{
    const id = req.params.id;
    const user_id = req.user.userId
    try{
        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 and user_id = $2 RETURNING *', [id, user_id]
        );
        if(result.rowCount === 0){
            return res.status(404).json({
                message: "Note does not exist"
            });
        }
        return res.status(200).json({
            message: "Note deleted successfully.",
            data: result.rows[0]
        });
    }catch(error){
        next(error);
    }
});
module.exports = router;