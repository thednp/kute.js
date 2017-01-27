### KUTE.js - The Light Tweening Engine
# by dnp_theme
# Licensed under MIT-License
###

((root, factory) ->
  if typeof define == 'function' and define.amd
    define [], factory
    # AMD. Register as an anonymous module.
  else if typeof exports == 'object'
    module.exports = factory()
    # Node, not strict CommonJS
  else
    root.KUTE = factory()
  return
) this, ->
  'use strict'
  # set a custom scope for KUTE.js
  g = if typeof global != 'undefined' then global else window
  time = g.performance
  tweens = []
  tick = null
  # tick must be null!!
  #supported properties
  _colors = [
    'color'
    'backgroundColor'
  ]
  _boxModel = [
    'top'
    'left'
    'width'
    'height'
  ]
  _transform = [
    'translate3d'
    'translateX'
    'translateY'
    'translateZ'
    'rotate'
    'translate'
    'rotateX'
    'rotateY'
    'rotateZ'
    'skewX'
    'skewY'
    'scale'
  ]
  _scroll = [ 'scroll' ]
  _opacity = [ 'opacity' ]
  _all = _colors.concat(_opacity, _boxModel, _transform)
  al = _all.length
  _defaults = {}
  #all properties default values
  #populate default values object
  i = 0
  while i < al
    p = _all[i]
    if _colors.indexOf(p) != -1
      _defaults[p] = 'rgba(0,0,0,0)'
      # _defaults[p] = {r:0,g:0,b:0,a:1}; // no unit/suffix
    else if _boxModel.indexOf(p) != -1
      _defaults[p] = 0
    else if p == 'translate3d'
      # px
      _defaults[p] = [
        0
        0
        0
      ]
    else if p == 'translate'
      # px
      _defaults[p] = [
        0
        0
      ]
    else if p == 'rotate' or /X|Y|Z/.test(p)
      # deg
      _defaults[p] = 0
    else if p == 'scale' or p == 'opacity'
      # unitless
      _defaults[p] = 1
    p = null
    i++
  # default tween options, since 1.6.1
  defaultOptions = 
    duration: 700
    delay: 0
    offset: 0
    repeat: 0
    repeatDelay: 0
    yoyo: false
    easing: 'linear'
    keepHex: false

  getPrefix = ->
    `var i`
    `var i`
    #returns browser prefix
    div = document.createElement('div')
    i = 0
    pf = [
      'Moz'
      'moz'
      'Webkit'
      'webkit'
      'O'
      'o'
      'Ms'
      'ms'
    ]
    s = [
      'MozTransform'
      'mozTransform'
      'WebkitTransform'
      'webkitTransform'
      'OTransform'
      'oTransform'
      'MsTransform'
      'msTransform'
    ]
    i = 0
    pl = pf.length
    while i < pl
      if s[i] of div.style
        return pf[i]
      i++
    div = null
    return

  property = (p) ->
    # returns prefixed property | property
    r = if !(p of document.body.style) then true else false
    f = getPrefix()
    # is prefix required for property | prefix
    if r then f + p.charAt(0).toUpperCase() + p.slice(1) else p

  selector = (el, multi) ->
    # a public selector utility
    nl = undefined
    if multi
      nl = if el instanceof Object or typeof el == 'object' then el else document.querySelectorAll(el)
    else
      nl = if typeof el == 'object' then el else if /^#/.test(el) then document.getElementById(el.replace('#', '')) else document.querySelector(el)
    if nl == null and el != 'window'
      throw new TypeError('Element not found or incorrect selector: ' + el)
    nl

  radToDeg = (a) ->
    a * 180 / Math.PI

  trueDimension = (d, p) ->
    `var i`
    #true dimension returns { v = value, u = unit }
    x = parseInt(d) or 0
    mu = [
      'px'
      '%'
      'deg'
      'rad'
      'em'
      'rem'
      'vh'
      'vw'
    ]
    y = undefined
    i = 0
    l = mu.length
    while i < l
      if typeof d == 'string' and d.indexOf(mu[i]) != -1
        y = mu[i]
        break
      i++
    y = if y != undefined then y else if p then 'deg' else 'px'
    {
      v: x
      u: y
    }

  trueColor = (v) ->
    # replace transparent and transform any color to rgba()/rgb()
    if /rgb|rgba/.test(v)
      # first check if it's a rgb string
      vrgb = v.replace(/\s|\)/, '').split('(')[1].split(',')
      y = if vrgb[3] then vrgb[3] else null
      if !y
        return {
          r: parseInt(vrgb[0])
          g: parseInt(vrgb[1])
          b: parseInt(vrgb[2])
        }
      else
        return {
          r: parseInt(vrgb[0])
          g: parseInt(vrgb[1])
          b: parseInt(vrgb[2])
          a: parseFloat(y)
        }
    else if /^#/.test(v)
      fromHex = hexToRGB(v)
      return {
        r: fromHex.r
        g: fromHex.g
        b: fromHex.b
      }
    else if /transparent|none|initial|inherit/.test(v)
      return {
        r: 0
        g: 0
        b: 0
        a: 0
      }
    else if !/^#|^rgb/.test(v)
      # maybe we can check for web safe colors
      h = document.getElementsByTagName('head')[0]
      h.style.color = v
      webColor = g.getComputedStyle(h, null).color
      webColor = if /rgb/.test(webColor) then webColor.replace(/[^\d,]/g, '').split(',') else [
        0
        0
        0
      ]
      h.style.color = ''
      return {
        r: parseInt(webColor[0])
        g: parseInt(webColor[1])
        b: parseInt(webColor[2])
      }
    return

  rgbToHex = (r, g, b) ->
    # transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  hexToRGB = (hex) ->
    shr = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    # Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(shr, (m, r, g, b) ->
      r + r + g + g + b + b
    )
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if result then
      r: parseInt(result[1], 16)
      g: parseInt(result[2], 16)
      b: parseInt(result[3], 16) else null

  getInlineStyle = (el, p) ->
    `var i`
    # get transform style for element from cssText for .to() method, the sp is for transform property
    if !el
      return
    # if the scroll applies to `window` it returns as it has no styling
    css = el.style.cssText.replace(/\s/g, '').split(';')
    trsf = {}
    #the transform object
    # if we have any inline style in the cssText attribute, usually it has higher priority
    i = 0
    csl = css.length
    while i < csl
      if /transform/i.test(css[i])
        tps = css[i].split(':')[1].split(')')
        #all transform properties
        k = 0
        tpl = tps.length - 1
        while k < tpl
          tpv = tps[k].split('(')
          tp = tpv[0]
          tv = tpv[1]
          #each transform property
          if _transform.indexOf(tp) != -1
            trsf[tp] = if /translate3d/.test(tp) then tv.split(',') else tv
          k++
      i++
    trsf

  getCurrentStyle = (el, p) ->
    # get computed style property for element for .to() method
    styleAttribute = el.style
    computedStyle = g.getComputedStyle(el, null) or el.currentStyle
    pp = property(p)
    styleValue = if styleAttribute[p] and !/auto|initial|none|unset/.test(styleAttribute[p]) then styleAttribute[p] else computedStyle[pp]
    # s the property style value
    if p != 'transform' and (pp of computedStyle or pp of styleAttribute)
      if styleValue
        if pp == 'filter'
          # handle IE8 opacity
          filterValue = parseInt(styleValue.split('=')[1].replace(')', ''))
          return parseFloat(filterValue / 100)
        else
          return styleValue
      else
        return _defaults[p]
    return

  getAll = ->
    tweens

  removeAll = ->
    tweens = []
    return

  add = (tw) ->
    tweens.push tw
    return

  remove = (tw) ->
    `var i`
    i = tweens.indexOf(tw)
    if i != -1
      tweens.splice i, 1
    return

  stop = ->
    if tick
      _cancelAnimationFrame tick
      tick = null
    return

  canTouch = 'ontouchstart' of g or navigator and navigator.msMaxTouchPoints or false
  touchOrWheel = if canTouch then 'touchstart' else 'mousewheel'
  mouseEnter = 'mouseenter'
  _requestAnimationFrame = g.requestAnimationFrame or g.webkitRequestAnimationFrame or (c) ->
    setTimeout c, 16
  _cancelAnimationFrame = g.cancelAnimationFrame or g.webkitCancelRequestAnimationFrame or (c) ->
    clearTimeout c
  transformProperty = property('transform')
  body = document.body
  html = document.getElementsByTagName('HTML')[0]
  scrollContainer = if navigator and /webkit/i.test(navigator.userAgent) or document.compatMode == 'BackCompat' then body else html
  isIE = if navigator and new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) != null then parseFloat(RegExp.$1) else false
  isIE8 = isIE == 8
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  # we optimize morph depending on device type
  # KUTE.js INTERPOLATORS
  interpolate = g.Interpolate = {}
  number = 
  interpolate.number = (a, b, v) ->
    # number1, number2, progress
    a = +a
    b -= a
    a + b * v

  unit = 
  interpolate.unit = (a, b, u, v) ->
    # number1, number2, unit, progress
    a = +a
    b -= a
    a + b * v + u

  color = 
  interpolate.color = (a, b, v, h) ->
    # rgba1, rgba2, progress, convertToHex(true/false)
    _c = {}
    c = undefined
    n = number
    ep = ')'
    cm = ','
    r = 'rgb('
    ra = 'rgba('
    for c of b
      `c = c`
      _c[c] = if c != 'a' then number(a[c], b[c], v) >> 0 or 0 else if a[c] and b[c] then (number(a[c], b[c], v) * 100 >> 0) / 100 else null
    if h then rgbToHex(_c.r, _c.g, _c.b) else if !_c.a then r + _c.r + cm + _c.g + cm + _c.b + ep else ra + _c.r + cm + _c.g + cm + _c.b + cm + _c.a + ep

  translate = interpolate.translate = if isMobile then ((a, b, u, v) ->
    translation = {}
    for ax of b
      translation[ax] = (if a[ax] == b[ax] then b[ax] else a[ax] + (b[ax] - (a[ax])) * v >> 0) + u
    if translation.x or translation.y then 'translate(' + translation.x + ',' + translation.y + ')' else 'translate3d(' + translation.translateX + ',' + translation.translateY + ',' + translation.translateZ + ')'
  ) else ((a, b, u, v) ->
    translation = {}
    for ax of b
      translation[ax] = (if a[ax] == b[ax] then b[ax] else ((a[ax] + (b[ax] - (a[ax])) * v) * 100 >> 0) / 100) + u
    if translation.x or translation.y then 'translate(' + translation.x + ',' + translation.y + ')' else 'translate3d(' + translation.translateX + ',' + translation.translateY + ',' + translation.translateZ + ')'
  )
  rotate = 
  interpolate.rotate = (a, b, u, v) ->
    rotation = {}
    for rx of b
      rotation[rx] = if rx == 'z' then 'rotate(' + ((a[rx] + (b[rx] - (a[rx])) * v) * 100 >> 0) / 100 + u + ')' else rx + '(' + ((a[rx] + (b[rx] - (a[rx])) * v) * 100 >> 0) / 100 + u + ')'
    if rotation.z then rotation.z else (rotation.rotateX or '') + (rotation.rotateY or '') + (rotation.rotateZ or '')

  skew = 
  interpolate.skew = (a, b, u, v) ->
    skewProp = {}
    for sx of b
      skewProp[sx] = sx + '(' + ((a[sx] + (b[sx] - (a[sx])) * v) * 10 >> 0) / 10 + u + ')'
    (skewProp.skewX or '') + (skewProp.skewY or '')

  scale = 
  interpolate.scale = (a, b, v) ->
    'scale(' + ((a + (b - a) * v) * 1000 >> 0) / 1000 + ')'

  DOM = {}

  ticker = (t) ->
    `var i`
    i = 0
    while i < tweens.length
      if update.call(tweens[i], t)
        i++
      else
        tweens.splice i, 1
    tick = _requestAnimationFrame(ticker)
    return

  update = (t) ->
    `var p`
    `var i`
    t = t or time.now()
    if t < @_startTime and @playing
      return true
    elapsed = Math.min((t - (@_startTime)) / @options.duration, 1)
    progress = @options.easing(elapsed)
    # calculate progress
    for p of @valuesEnd
      DOM[p] @element, p, @valuesStart[p], @valuesEnd[p], progress, @options
    #render the CSS update
    if @options.update
      @options.update.call()
    # fire the updateCallback
    if elapsed == 1
      if @options.repeat > 0
        if isFinite(@options.repeat)
          @options.repeat--
        if @options.yoyo
          # handle yoyo
          @reversed = !@reversed
          reverse.call this
        @_startTime = if @options.yoyo and !@reversed then t + @options.repeatDelay else t
        #set the right time for delay
        return true
      else
        if @options.complete
          @options.complete.call()
        scrollOut.call this
        # unbind preventing scroll when scroll tween finished
        i = 0
        ctl = @options.chain.length
        while i < ctl
          # start animating chained tweens
          @options.chain[i].start()
          i++
        #stop ticking when finished
        close.call this
      return false
    true

  perspective = ->
    el = @element
    ops = @options
    if ops.perspective != undefined and transformProperty of @valuesEnd
      # element perspective
      @valuesStart[transformProperty]['perspective'] = @valuesEnd[transformProperty]['perspective']
    # element transform origin / we filter it out for svgTransform to fix the Firefox transformOrigin bug https://bugzilla.mozilla.org/show_bug.cgi?id=923193
    if ops.transformOrigin != undefined and !('svgTransform' of @valuesEnd)
      el.style[property('transformOrigin')] = ops.transformOrigin
    # set transformOrigin for CSS3 transforms only
    if ops.perspectiveOrigin != undefined
      el.style[property('perspectiveOrigin')] = ops.perspectiveOrigin
    # element perspective origin
    if ops.parentPerspective != undefined
      el.parentNode.style[property('perspective')] = ops.parentPerspective + 'px'
    # parent perspective
    if ops.parentPerspectiveOrigin != undefined
      el.parentNode.style[property('perspectiveOrigin')] = ops.parentPerspectiveOrigin
    # parent perspective origin
    return

  prepareStart = {}
  crossCheck = {}
  parseProperty = 
    boxModel: (p, v) ->
      if !(p of DOM)

        DOM[p] = (l, p, a, b, v) ->
          l.style[p] = (if v > 0.99 or v < 0.01 then (number(a, b, v) * 10 >> 0) / 10 else number(a, b, v) >> 0) + 'px'
          return

      boxValue = trueDimension(v)
      if boxValue.u == '%' then boxValue.v * @element.offsetWidth / 100 else boxValue.v
    transform: (p, v) ->
      if !(transformProperty of DOM)

        DOM[transformProperty] = (l, p, a, b, v, o) ->
          l.style[p] = (a.perspective or '') + (if 'translate' of a then translate(a.translate, b.translate, 'px', v) else '') + (if 'rotate' of a then rotate(a.rotate, b.rotate, 'deg', v) else '') + (if 'skew' of a then skew(a.skew, b.skew, 'deg', v) else '') + (if 'scale' of a then scale(a.scale, b.scale, v) else '')
          return

      # process each transform property
      if /translate/.test(p)
        if p == 'translate3d'
          t3d = v.split(',')
          t3d0 = trueDimension(t3d[0])
          t3d1 = trueDimension(t3d[1], t3d2 = trueDimension(t3d[2]))
          return {
            translateX: if t3d0.u == '%' then t3d0.v * @element.offsetWidth / 100 else t3d0.v
            translateY: if t3d1.u == '%' then t3d1.v * @element.offsetHeight / 100 else t3d1.v
            translateZ: if t3d2.u == '%' then t3d2.v * (@element.offsetHeight + @element.offsetWidth) / 200 else t3d2.v
          }
        else if /^translate(?:[XYZ])$/.test(p)
          t1d = trueDimension(v)
          percentOffset = if /X/.test(p) then @element.offsetWidth / 100 else if /Y/.test(p) then @element.offsetHeight / 100 else (@element.offsetWidth + @element.offsetHeight) / 200
          return if t1d.u == '%' then t1d.v * percentOffset else t1d.v
        else if p == 'translate'
          tv = if typeof v == 'string' then v.split(',') else v
          t2d = {}
          t2dv = undefined
          t2d0 = trueDimension(tv[0])
          t2d1 = if tv.length then trueDimension(tv[1]) else
            v: 0
            u: 'px'
          if tv instanceof Array
            t2d.x = if t2d0.u == '%' then t2d0.v * @element.offsetWidth / 100 else t2d0.v
            t2d.y = if t2d1.u == '%' then t2d1.v * @element.offsetHeight / 100 else t2d1.v
          else
            t2dv = trueDimension(tv)
            t2d.x = if t2dv.u == '%' then t2dv.v * @element.offsetWidth / 100 else t2dv.v
            t2d.y = 0
          return t2d
      else if /rotate|skew/.test(p)
        if /^rotate(?:[XYZ])$|skew(?:[XY])$/.test(p)
          r3d = trueDimension(v, true)
          return if r3d.u == 'rad' then radToDeg(r3d.v) else r3d.v
        else if p == 'rotate'
          r2d = {}
          r2dv = trueDimension(v, true)
          r2d.z = if r2dv.u == 'rad' then radToDeg(r2dv.v) else r2dv.v
          return r2d
      else if p == 'scale'
        return parseFloat(v)
        # this must be parseFloat(v)
      return
    unitless: (p, v) ->
      # scroll | opacity
      if /scroll/.test(p) and !(p of DOM)

        DOM[p] = (l, p, a, b, v) ->
          l.scrollTop = number(a, b, v) >> 0
          return

      else if p == 'opacity'
        if !(p of DOM)
          if isIE8

            DOM[p] = (l, p, a, b, v) ->
              st = 'alpha(opacity='
              ep = ')'
              l.style.filter = st + (number(a, b, v) * 100 >> 0) + ep
              return

          else

            DOM[p] = (l, p, a, b, v) ->
              l.style.opacity = (number(a, b, v) * 100 >> 0) / 100
              return

      parseFloat v
    colors: (p, v) ->
      # colors
      if !(p of DOM)

        DOM[p] = (l, p, a, b, v, o) ->
          l.style[p] = color(a, b, v, o.keepHex)
          return

      trueColor v

  preparePropertiesObject = (obj, fn) ->
    # this, props object, type: start/end
    element = @element
    propertiesObject = if fn == 'start' then @valuesStart else @valuesEnd
    skewObject = {}
    rotateObject = {}
    translateObject = {}
    transformObject = {}
    for x of obj
      if _transform.indexOf(x) != -1
        # transform object gets built here
        if /^translate(?:[XYZ]|3d)$/.test(x)
          #process translate3d
          ta = [
            'X'
            'Y'
            'Z'
          ]
          #coordinates //   translate[x] = pp(x, obj[x]);
          f = 0
          while f < 3
            a = ta[f]
            if /3d/.test(x)
              translateObject['translate' + a] = parseProperty.transform.call(this, 'translate' + a, obj[x][f])
            else
              translateObject['translate' + a] = if 'translate' + a of obj then parseProperty.transform.call(this, 'translate' + a, obj['translate' + a]) else 0
            f++
          transformObject['translate'] = translateObject
        else if /^rotate(?:[XYZ])$|^skew(?:[XY])$/.test(x)
          #process rotation/skew
          ap = if /rotate/.test(x) then 'rotate' else 'skew'
          ra = [
            'X'
            'Y'
            'Z'
          ]
          rtp = if ap == 'rotate' then rotateObject else skewObject
          r = 0
          while r < 3
            v = ra[r]
            if obj[ap + v] != undefined and x != 'skewZ'
              rtp[ap + v] = parseProperty.transform.call(this, ap + v, obj[ap + v])
            r++
          transformObject[ap] = rtp
        else if /(rotate|translate|scale)$/.test(x)
          #process 2d translation / rotation
          transformObject[x] = parseProperty.transform.call(this, x, obj[x])
        propertiesObject[transformProperty] = transformObject
      else
        if _boxModel.indexOf(x) != -1
          propertiesObject[x] = parseProperty.boxModel.call(this, x, obj[x])
        else if _opacity.indexOf(x) != -1 or x == 'scroll'
          propertiesObject[x] = parseProperty.unitless.call(this, x, obj[x])
        else if _colors.indexOf(x) != -1
          propertiesObject[x] = parseProperty.colors.call(this, x, obj[x])
        else if x of parseProperty
          # or any other property from css/ attr / svg / third party plugins
          propertiesObject[x] = parseProperty[x].call(this, x, obj[x])
    return

  reverse = ->
    `var p`
    if @options.yoyo
      for p of @valuesEnd
        tmp = @valuesRepeat[p]
        @valuesRepeat[p] = @valuesEnd[p]
        @valuesEnd[p] = tmp
        @valuesStart[p] = @valuesRepeat[p]
    return

  close = ->
    #  when animation is finished reset repeat, yoyo&reversed tweens
    if @repeat > 0
      @options.repeat = @repeat
    if @options.yoyo and @reversed == true
      reverse.call this
      @reversed = false
    @playing = false
    setTimeout (->
      if !tweens.length
        stop()
      return
    ), 48
    # when all animations are finished, stop ticking after ~3 frames
    return

  preventScroll = (e) ->
    # prevent mousewheel or touch events while tweening scroll
    data = document.body.getAttribute('data-tweening')
    if data and data == 'scroll'
      e.preventDefault()
    return

  scrollOut = ->
    #prevent scroll when tweening scroll
    if 'scroll' of @valuesEnd and document.body.getAttribute('data-tweening')
      document.removeEventListener touchOrWheel, preventScroll, false
      document.removeEventListener mouseEnter, preventScroll, false
      document.body.removeAttribute 'data-tweening'
    return

  scrollIn = ->
    if 'scroll' of @valuesEnd and !document.body.getAttribute('data-tweening')
      document.addEventListener touchOrWheel, preventScroll, false
      document.addEventListener mouseEnter, preventScroll, false
      document.body.setAttribute 'data-tweening', 'scroll'
    return

  processEasing = (fn) ->
    #process easing function
    if typeof fn == 'function'
      return fn
    else if typeof fn == 'string'
      return easing[fn]
      # regular Robert Penner Easing Functions
    return

  getStartValues = ->
    `var p`
    `var p`
    # stack transform props for .to() chains
    startValues = {}
    currentStyle = getInlineStyle(@element, 'transform')
    deg = [
      'rotate'
      'skew'
    ]
    ax = [
      'X'
      'Y'
      'Z'
    ]
    for p of @valuesStart
      if _transform.indexOf(p) != -1
        r2d = /(rotate|translate|scale)$/.test(p)
        if /translate/.test(p) and p != 'translate'
          startValues['translate3d'] = currentStyle['translate3d'] or _defaults[p]
        else if r2d
          # 2d transforms
          startValues[p] = currentStyle[p] or _defaults[p]
        else if !r2d and /rotate|skew/.test(p)
          # all angles
          d = 0
          while d < 2
            a = 0
            while a < 3
              s = deg[d] + ax[a]
              if _transform.indexOf(s) != -1 and s of @valuesStart
                startValues[s] = currentStyle[s] or _defaults[s]
              a++
            d++
      else
        if p != 'scroll'
          if p == 'opacity' and isIE8
            # handle IE8 opacity
            currentOpacity = getCurrentStyle(@element, 'filter')
            startValues['opacity'] = if typeof currentOpacity == 'number' then currentOpacity else _defaults['opacity']
          else
            if _all.indexOf(p) != -1
              startValues[p] = getCurrentStyle(@element, p) or d[p]
            else
              # plugins register here
              startValues[p] = if p of prepareStart then prepareStart[p].call(this, p, @valuesStart[p]) else 0
        else
          startValues[p] = if @element == scrollContainer then g.pageYOffset or scrollContainer.scrollTop else @element.scrollTop
    for p of currentStyle
      # also add to startValues values from previous tweens
      if _transform.indexOf(p) != -1 and !(p of @valuesStart)
        startValues[p] = currentStyle[p] or _defaults[p]
    @valuesStart = {}
    preparePropertiesObject.call this, startValues, 'start'
    if transformProperty of @valuesEnd
      # let's stack transform
      for sp of @valuesStart[transformProperty]
        # sp is the object corresponding to the transform function objects translate / rotate / skew / scale
        if sp != 'perspective'
          if typeof @valuesStart[transformProperty][sp] == 'object'
            for spp of @valuesStart[transformProperty][sp]
              # 3rd level
              if typeof @valuesEnd[transformProperty][sp] == 'undefined'
                @valuesEnd[transformProperty][sp] = {}
              if typeof @valuesStart[transformProperty][sp][spp] == 'number' and typeof @valuesEnd[transformProperty][sp][spp] == 'undefined'
                @valuesEnd[transformProperty][sp][spp] = @valuesStart[transformProperty][sp][spp]
          else if typeof @valuesStart[transformProperty][sp] == 'number'
            if typeof @valuesEnd[transformProperty][sp] == 'undefined'
              # scale
              @valuesEnd[transformProperty][sp] = @valuesStart[transformProperty][sp]
    return

  # core easing functions
  easing = g.Easing = {}

  easing.linear = (t) ->
    t

  easing.easingSinusoidalIn = (t) ->
    -Math.cos(t * Math.PI / 2) + 1

  easing.easingSinusoidalOut = (t) ->
    Math.sin t * Math.PI / 2

  easing.easingSinusoidalInOut = (t) ->
    -0.5 * (Math.cos(Math.PI * t) - 1)

  easing.easingQuadraticIn = (t) ->
    t * t

  easing.easingQuadraticOut = (t) ->
    t * (2 - t)

  easing.easingQuadraticInOut = (t) ->
    if t < .5 then 2 * t * t else -1 + (4 - (2 * t)) * t

  easing.easingCubicIn = (t) ->
    t * t * t

  easing.easingCubicOut = (t) ->
    --t * t * t + 1

  easing.easingCubicInOut = (t) ->
    if t < .5 then 4 * t * t * t else (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

  easing.easingQuarticIn = (t) ->
    t * t * t * t

  easing.easingQuarticOut = (t) ->
    1 - (--t * t * t * t)

  easing.easingQuarticInOut = (t) ->
    if t < .5 then 8 * t * t * t * t else 1 - (8 * --t * t * t * t)

  easing.easingQuinticIn = (t) ->
    t * t * t * t * t

  easing.easingQuinticOut = (t) ->
    1 + --t * t * t * t * t

  easing.easingQuinticInOut = (t) ->
    if t < .5 then 16 * t * t * t * t * t else 1 + 16 * --t * t * t * t * t

  easing.easingCircularIn = (t) ->
    -(Math.sqrt(1 - (t * t)) - 1)

  easing.easingCircularOut = (t) ->
    Math.sqrt 1 - ((t = t - 1) * t)

  easing.easingCircularInOut = (t) ->
    if (t *= 2) < 1 then -0.5 * (Math.sqrt(1 - (t * t)) - 1) else 0.5 * (Math.sqrt(1 - ((t -= 2) * t)) + 1)

  easing.easingExponentialIn = (t) ->
    2 ** (10 * (t - 1)) - 0.001

  easing.easingExponentialOut = (t) ->
    1 - 2 ** (-10 * t)

  easing.easingExponentialInOut = (t) ->
    if (t *= 2) < 1 then 0.5 * 2 ** (10 * (t - 1)) else 0.5 * (2 - 2 ** (-10 * (t - 1)))

  easing.easingBackIn = (t) ->
    s = 1.70158
    t * t * ((s + 1) * t - s)

  easing.easingBackOut = (t) ->
    s = 1.70158
    --t * t * ((s + 1) * t + s) + 1

  easing.easingBackInOut = (t) ->
    s = 1.70158 * 1.525
    if (t *= 2) < 1
      return 0.5 * t * t * ((s + 1) * t - s)
    0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)

  easing.easingElasticIn = (t) ->
    s = undefined
    _kea = 0.1
    _kep = 0.4
    if t == 0
      return 0
    if t == 1
      return 1
    if !_kea or _kea < 1
      _kea = 1
      s = _kep / 4
    else
      s = _kep * Math.asin(1 / _kea) / Math.PI * 2
    -(_kea * 2 ** (10 * (t -= 1)) * Math.sin((t - s) * Math.PI * 2 / _kep))

  easing.easingElasticOut = (t) ->
    s = undefined
    _kea = 0.1
    _kep = 0.4
    if t == 0
      return 0
    if t == 1
      return 1
    if !_kea or _kea < 1
      _kea = 1
      s = _kep / 4
    else
      s = _kep * Math.asin(1 / _kea) / Math.PI * 2
    _kea * 2 ** (-10 * t) * Math.sin((t - s) * Math.PI * 2 / _kep) + 1

  easing.easingElasticInOut = (t) ->
    s = undefined
    _kea = 0.1
    _kep = 0.4
    if t == 0
      return 0
    if t == 1
      return 1
    if !_kea or _kea < 1
      _kea = 1
      s = _kep / 4
    else
      s = _kep * Math.asin(1 / _kea) / Math.PI * 2
    if (t *= 2) < 1
      return -0.5 * _kea * 2 ** (10 * (t -= 1)) * Math.sin((t - s) * Math.PI * 2 / _kep)
    _kea * 2 ** (-10 * (t -= 1)) * Math.sin((t - s) * Math.PI * 2 / _kep) * 0.5 + 1

  easing.easingBounceIn = (t) ->
    1 - easing.easingBounceOut(1 - t)

  easing.easingBounceOut = (t) ->
    if t < 1 / 2.75
      7.5625 * t * t
    else if t < 2 / 2.75
      7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    else if t < 2.5 / 2.75
      7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    else
      7.5625 * (t -= 2.625 / 2.75) * t + 0.984375

  easing.easingBounceInOut = (t) ->
    if t < 0.5
      return easing.easingBounceIn(t * 2) * 0.5
    easing.easingBounceOut(t * 2 - 1) * 0.5 + 0.5

  # single Tween object construct

  Tween = (targetElement, startObject, endObject, options) ->
    @element = if 'scroll' of endObject and (targetElement == undefined or targetElement == null) then scrollContainer else targetElement
    # element animation is applied to
    @playing = false
    @reversed = false
    @paused = false
    @_startTime = null
    @_pauseTime = null
    @_startFired = false
    @options = {}
    for o of options
      @options[o] = options[o]
    @options.rpr = options.rpr or false
    # internal option to process inline/computed style at start instead of init true/false
    @valuesRepeat = {}
    # internal valuesRepeat
    @valuesEnd = {}
    # valuesEnd
    @valuesStart = {}
    # valuesStart
    preparePropertiesObject.call this, endObject, 'end'
    # valuesEnd
    if @options.rpr
      @valuesStart = startObject
    else
      preparePropertiesObject.call this, startObject, 'start'
    # valuesStart
    if @options.perspective != undefined and transformProperty of @valuesEnd
      # element transform perspective
      perspectiveString = 'perspective(' + parseInt(@options.perspective) + 'px)'
      @valuesEnd[transformProperty].perspective = perspectiveString
    for e of @valuesEnd
      if e of crossCheck and !@options.rpr
        crossCheck[e].call this
      # this is where we do the valuesStart and valuesEnd check for fromTo() method
    @options.chain = []
    # chained Tweens
    @options.easing = if options.easing and typeof processEasing(options.easing) == 'function' then processEasing(options.easing) else easing[defaultOptions.easing]
    # you can only set a core easing function as default
    @options.repeat = options.repeat or defaultOptions.repeat
    @options.repeatDelay = options.repeatDelay or defaultOptions.repeatDelay
    @options.yoyo = options.yoyo or defaultOptions.yoyo
    @options.duration = options.duration or defaultOptions.duration
    # duration option | default
    @options.delay = options.delay or defaultOptions.delay
    # delay option | default
    @repeat = @options.repeat
    # we cache the number of repeats to be able to put it back after all cycles finish
    return

  TweenProto = Tween.prototype =
    start: (t) ->
      # move functions that use the ticker outside the prototype to be in the same scope with it
      scrollIn.call this
      if @options.rpr
        getStartValues.apply this
      # on start we reprocess the valuesStart for TO() method
      perspective.apply this
      # apply the perspective and transform origin
      for e of @valuesEnd
        if e of crossCheck and @options.rpr
          crossCheck[e].call this
        # this is where we do the valuesStart and valuesEnd check for to() method
        @valuesRepeat[e] = @valuesStart[e]
      # now it's a good time to start
      tweens.push this
      @playing = true
      @paused = false
      @_startFired = false
      @_startTime = t or time.now()
      @_startTime += @options.delay
      if !@_startFired
        if @options.start
          @options.start.call()
        @_startFired = true
      !tick and ticker()
      this
    play: ->
      if @paused and @playing
        @paused = false
        if @options.resume
          @options.resume.call()
        @_startTime += time.now() - (@_pauseTime)
        add this
        !tick and ticker()
        # restart ticking if stopped
      this
    resume: ->
      @play()
    pause: ->
      if !@paused and @playing
        remove this
        @paused = true
        @_pauseTime = time.now()
        if @options.pause
          @options.pause.call()
      this
    stop: ->
      if !@paused and @playing
        remove this
        @playing = false
        @paused = false
        scrollOut.call this
        if @options.stop
          @options.stop.call()
        @stopChainedTweens()
        close.call this
      this
    chain: ->
      @options.chain = arguments
      this
    stopChainedTweens: ->
      `var i`
      i = 0
      ctl = @options.chain.length
      while i < ctl
        @options.chain[i].stop()
        i++
      return

  TweensTO = (els, vE, o) ->
    `var i`
    # .to
    @tweens = []
    options = []
    i = 0
    tl = els.length
    while i < tl
      options[i] = o or {}
      o.delay = o.delay or defaultOptions.delay
      options[i].delay = if i > 0 then o.delay + (o.offset or defaultOptions.offset) else o.delay
      @tweens.push to(els[i], vE, options[i])
      i++
    return

  TweensFT = (els, vS, vE, o) ->
    `var i`
    # .fromTo
    @tweens = []
    options = []
    i = 0
    l = els.length
    while i < l
      options[i] = o or {}
      o.delay = o.delay or defaultOptions.delay
      options[i].delay = if i > 0 then o.delay + (o.offset or defaultOptions.offset) else o.delay
      @tweens.push fromTo(els[i], vS, vE, options[i])
      i++
    return

  ws = TweensTO.prototype = TweensFT.prototype =
    start: (t) ->
      `var i`
      t = t or time.now()
      i = 0
      tl = @tweens.length
      while i < tl
        @tweens[i].start t
        i++
      this
    stop: ->
      `var i`
      i = 0
      tl = @tweens.length
      while i < tl
        @tweens[i].stop()
        i++
      this
    pause: ->
      `var i`
      i = 0
      tl = @tweens.length
      while i < tl
        @tweens[i].pause()
        i++
      this
    chain: ->
      @tweens[@tweens.length - 1].options.chain = arguments
      this
    play: ->
      `var i`
      i = 0
      tl = @tweens.length
      while i < tl
        @tweens[i].play()
        i++
      this
    resume: ->
      @play()

  to = (element, endObject, options) ->
    options = options or {}
    options.rpr = true
    new Tween(selector(element), endObject, endObject, options)

  fromTo = (element, startObject, endObject, options) ->
    options = options or {}
    new Tween(selector(element), startObject, endObject, options)

  allTo = (elements, endObject, options) ->
    new TweensTO(selector(elements, true), endObject, options)

  allFromTo = (elements, f, endObject, options) ->
    new TweensFT(selector(elements, true), f, endObject, options)

  {
    property: property
    getPrefix: getPrefix
    selector: selector
    processEasing: processEasing
    defaultOptions: defaultOptions
    to: to
    fromTo: fromTo
    allTo: allTo
    allFromTo: allFromTo
    ticker: ticker
    tick: tick
    tweens: tweens
    update: update
    dom: DOM
    parseProperty: parseProperty
    prepareStart: prepareStart
    crossCheck: crossCheck
    Tween: Tween
    truD: trueDimension
    truC: trueColor
    rth: rgbToHex
    htr: hexToRGB
    getCurrentStyle: getCurrentStyle
  }
