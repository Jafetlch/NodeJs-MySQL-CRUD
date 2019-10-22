const express = require('express')
const router = express.Router()

const db = require('../database')
const { isLoggedIn } = require('../lib/auth')
// fth create
router.get('/add', isLoggedIn, (req, res) => {
  res.render('links/add')
})

router.post('/add', isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  }
  await db.query('INSERT INTO links set ?', [newLink])
  req.flash('success', 'Link added successfully')
  res.redirect('/links')
})

// fth index
router.get('/', isLoggedIn, async (req, res) => {
  const links = await db.query('SELECT * FROM links WHERE user_id = ?', [
    req.user.id
  ])
  res.render('links/list', { links })
})

// fth delete
router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  await db.query('DELETE FROM links WHERE ID = ?', [id])
  req.flash('success', 'Link deleted Successfully')
  res.redirect('/links')
})

// fth edit
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const data = await db.query('SELECT * FROM links WHERE Id = ?', [id])
  res.render('links/edit', { data: data[0] })
})
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { title, url, description } = req.body
  const newLink = {
    title,
    url,
    description
  }
  await db.query('UPDATE links set ? WHERE id = ?', [newLink, id])
  req.flash('success', 'Link Updated Successfully')
  res.redirect('/links')
})

module.exports = router
