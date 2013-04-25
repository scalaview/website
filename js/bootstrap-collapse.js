/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($j) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$jelement = $j(element)
    this.options = $j.extend({}, $j.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$jparent = $j(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$jelement.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $j.camelCase(['scroll', dimension].join('-'))
      actives = this.$jparent && this.$jparent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$jelement[dimension](0)
      this.transition('addClass', $j.Event('show'), 'shown')
      this.$jelement[dimension](this.$jelement[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$jelement[dimension]())
      this.transition('removeClass', $j.Event('hide'), 'hidden')
      this.$jelement[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$jelement
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$jelement[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$jelement.trigger(completeEvent)
          }

      this.$jelement.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$jelement[method]('in')

      $j.support.transition && this.$jelement.hasClass('collapse') ?
        this.$jelement.one($j.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$jelement.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $j.fn.collapse = function (option) {
    return this.each(function () {
      var $jthis = $j(this)
        , data = $jthis.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $jthis.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $j.fn.collapse.defaults = {
    toggle: true
  }

  $j.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $j(function () {
    $j('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $jthis = $j(this), href
        , target = $jthis.attr('data-target')
          || e.preventDefault()
          || (href = $jthis.attr('href')) && href.replace(/.*(?=#[^\s]+$j)/, '') //strip for ie7
        , option = $j(target).data('collapse') ? 'toggle' : $jthis.data()
      $j(target).collapse(option)
    })
  })

}(window.jQuery);