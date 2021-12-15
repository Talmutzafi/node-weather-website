const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = 3000
console.log('dirName', path.join(__dirname, '../public/index.html'))


const publicDirectory = path.join(__dirname, '../public')
const viewsesPath = path.join(__dirname, '../templates/viewes') //customize the need to use the viewers default name
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)


app.set('views', viewsesPath)
app.set('view engine', 'hbs')
app.use(express.static(publicDirectory))


/*render using hbs - seaches index when ''*/
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Tal'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Weather App',
    name: 'Tal'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'help texttt', 
    title: 'Weather App',
    name: 'Tal' 
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
      title: '404',
      name: 'Tal',
      errorMessage: 'Help article not found.'
  })
})
app.get('/weather', (req, res) => {
  if (!req.query.address) {
      return res.send({
          error: 'You must provide an address!'
      })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
        return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })
})
})



app.get('/products', (req, res) => {
  console.log(req.query.search)
  if (!req.query.search) {
    res.send({
      error: 'You mush provide a search term'
    })
    return
  }
  res.send({
      products: []
  })
})

app.get('*', (req, res) => {
  res.render('404', {
      title: '404',
      name: 'Tal',
      errorMessage: 'Page not found.'
  })
})

// app.get('/', (req, res) => {
//   res.send('<h1>Weather App Intro</h1>')
// })

// app.get('/help', (req, res) => {
//     res.send({
//       name: 'tal',
//       age: '333'
//     })
//   })

//   app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>')
//   })

//   app.get('/weather', (req, res) => {
//     res.send({
//       forecast: 'Its Raining',
//       location: 'Heerzelia'
//     })
//   })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})