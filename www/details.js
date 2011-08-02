(function(m){
  m.Details = function(options) {
    var _options = $.extend({
      detailTarget: '.detail-container',
      detailHeader: '.detail-header'
    }, options),
    _id;

    function _refreshDetail(id) {
        var $container = $('div[data-url*="details.html?id='+id+'"]'),
            $detailTarget = $(_options.detailTarget, $container).html('Loading...');
        
        console.log('database = ');
        console.log(app.couch);
        
        $.mobile.showPageLoadingMsg();
        $.getJSON('http://'+app.couch+'/'+app.database+'/'+id+'?callback=?', function(artData) {
          var imagePath = '',
              imageHtml = '',
              detailsHtml = '';
          
          $.mobile.hidePageLoadingMsg();
          console.log(artData);
          // Set the page title
          $(_options.detailHeader, $container).html(artData.title);
        
          detailsHtml += '<div class="details_title">'+artData.title+'</div>';

          if(artData._attachments) {
              for(img in artData._attachments) {
                if(artData._attachments.hasOwnProperty(img)) {
                  imagePath = 'http://'+app.couch+'/'+app.database+'/'+id+'/'+img;
                  detailsHtml += '<img class="img-wrapper" src="'+imagePath+'" />';
                }
              }
          }
          detailsHtml += '<ul>';
          // Dump everything else onto the page
          $.each(artData, function(i, n) {
              // HACK - the following if could be done more gracefully
              if(n != '' && i != 'title' && i != 'geometry' && i != 'id' && i != '_id' && i != '_rev' && i != 'imgs') {
                  detailsHtml += '<li><strong>'+i+'</strong>'+n+'</li>';
              }
          });
          detailsHtml += '<ul>';
          detailsHtml += imageHtml;
          detailsHtml = '<div class="details_wrapper">'+detailsHtml+'</div>';
          $detailTarget.html(detailsHtml);
          
        });
        
        /*
        $.ajax({
            url: Muralapp.db.path+'/_design/assets/_list/jsonp/assetid?key="'+id+'"',
            crossDomain: true,
            dataType: 'jsonp',
            success: function (mural, textStatus, jqXHR) {            
                // Structure the data a bit
                mapMuralProperties(mural);

                // Set the page title
                $(_options.detailHeader, $container).html(mural.title);
                
                var detailsHtml = imageHtml = '';
                detailsHtml += '<div class="details_title">'+mural.title+'</div>';
        
                // This whole image handling code seems clunky
                // imgs[0] = thumbnail
                // imgs[1] = large main image
                // imgs[2-n] = secondary shots
                if(mural.imgs.length > 0) {
                    detailsHtml += (mural.imgs[0] != "noimage.png") ? '<img src="'+mural.imgs[0]+'" />' : '';
                    if(mural.imgs.length > 1) {
                        for(var i=2; i < mural.imgs.length; i++) {
                            imageHtml += '<img src="'+mural.imgs[i]+'" />';
                        }
                    }
                }
                detailsHtml += '<ul>';
                // Dump everything else onto the page
                $.each(mural, function(i, n) {
                    // HACK - the following if could be done more gracefully
                    if(n != '' && i != 'title' && i != 'geometry' && i != 'id' && i != '_id' && i != '_rev' && i != 'imgs') {
                        detailsHtml += '<li><strong>'+i+'</strong>'+n+'</li>';
                    }
                });
                detailsHtml += '<ul>';
                detailsHtml += imageHtml;
                detailsHtml = '<div class="details_wrapper">'+detailsHtml+'</div>';
                $detailTarget.html(detailsHtml);
                //$detailTarget.html($('description', $detail).text());
                
            },
            error: function(xhr, status, error) {
                console.log('server-side failure with status code ' + status);
            }
        });
        */
    };
    
    //http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript
    function _getParameterByName( name )
    {
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( window.location.href );
      if( results == null )
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    //http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
    function _calcDistance(point1, point2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (point2[0]-point1[0]).toRad();  // Javascript functions in radians
        var dLon = (point2[1]-point1[1]).toRad(); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(point1[0].toRad()) * Math.cos(point2[0].toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        
        return d;
    }
    
    
    //Init this page
    (function init() {
       //Get the id from the url
       _id = _getParameterByName('id');
       console.log('in the deets');
       _refreshDetail(_id);
    })();
  };
})(ArtFinder);