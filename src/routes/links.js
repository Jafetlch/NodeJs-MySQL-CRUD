const express = require('express')
const router = express.Router()

const db = require('../database')
// create
router.get('/add', (req, res) => {
  res.render('links/add')
})

router.post('/add', async (req, res) => {
  const { title, url, description } = req.body
  const newLink = {
    title,
    url,
    description
  }
  await db.query('INSERT INTO links set ?', [newLink])
  req.flash('success', 'Link added successfully')
  res.redirect('/links')
})

// index
router.get('/', async (req, res) => {
  const links = await db.query('SELECT * FROM links')
  res.render('links/list', { links })
})

// delete
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params
  await db.query('DELETE FROM links WHERE ID = ?', [id])
  req.flash('success', 'Link deleted Successfully')
  res.redirect('/links')
})

// edit
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params
  const data = await db.query('SELECT * FROM links WHERE Id = ?', [id])
  res.render('links/edit', { data: data[0] })
})
router.post('/edit/:id', async (req, res) => {
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
