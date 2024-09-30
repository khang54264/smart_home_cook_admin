const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');


// Lấy toàn bộ nguyên liệu
router.get('/getall', ingredientController.getAllIngre);

// Thêm nguyên liệu mới
router.post('/add', ingredientController.addIngre);

// Xóa nguyên liệu
router.delete('/delete/:_id', ingredientController.deleteIngre);

// Chỉnh sửa thông tin nguyên liệu
router.put('/update/:_id', ingredientController.updateIngre);

// Tìm kiếm nguyên liệu
router.get('/search', ingredientController.searchIngre);

module.exports = router;
