angular.module('vllaznia.controllers', [])

.controller('AppCtrl', function($scope) {
})

    .filter('html',function($sce){
     return function(input){
        return $sce.trustAsHtml(input);
      }
    })

   .filter('indexData', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd/MM/yyyy - HH:mm');
       return _date;
     };
    })

    .filter('ndeshjeData', function($filter){
      return function(input)
      {
        if(input == null){ return ""; }
        var value = input;
        var _date = $filter('date')(new Date(input),'dd/MM/yyyy - HH:mm');
        return _date;
      };
     })

  .filter('orderObjectBy', function() {
   return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
     if(reverse) filtered.reverse();
      return filtered;
    };
  })

    .controller('IndexCtrl', function($scope, $ionicSlideBoxDelegate, $state, $timeout, $ionicLoading, LajmeService, NdeshjetService) {
        var tani = new Date();
        var timerhide = 5000;
        ga_storage._trackPageview('#/app/index', 'Vllaznia App Index');
        if(navigator.splashscreen){
           navigator.splashscreen.hide();
        }
        $scope.live = true;
        $scope.loadNdeshje = false;
        $scope.go = function ( path ) {
          //alert(path);
          $state.go('app.ndeshja', {ndeshjaId: path} );
        };
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 100
	        });
        LajmeService.getSlider(function(data) {
           // gaPlugin = window.plugins.gaPlugin;
           // gaPlugin.init(successHandler, errorHandler, "UA-2341193-8", 10);
           // console.log("slider");
            $scope.slider = data;
            $ionicLoading.hide();
            $ionicSlideBoxDelegate.update();

        });
        NdeshjetService.getSuperligaLastNdeshje(function(data) {
            //alert(tani);
            //$scope.items = data;
            $scope.items = data.slice(0,2);
            $ionicLoading.hide();
            $scope.loadNdeshje = true;
        });

       $scope.customArrayFilter = function (item) {
         //console.log(tani);
         d2 = new Date(tani.getTime()- 800000000);
        // d3 = new Date(tani.getTime() + 800000000);

         //console.log(d2);
         d1 = new Date(item.data);
         //$scope.data = d1;
         return ( d1>d2);
       };


     (function update() {
        $timeout(update, 12000);
        NdeshjetService.getSuperligaLastNdeshje(function(data) {
            //console.log(tani);
            //$scope.items = data;
            $scope.items = data.slice(0,2);
        });
       }());

       $scope.ticker = function(orari, index) {
         if (index)
           { var w = 100;
           return w;
         }
         else{
         //var tani = new Date('Wed, 05 Mar 2015 15:10:00 +0000');
         var tani = new Date();
         //console.log(tani);
         var w = "0";
         var percenti;
         //console.log(orari);
         d1 = new Date(orari);
         //console.log(d1);
         time = ((tani.getTime() - d1.getTime())/ (1000 * 60));
         //console.log(time);
         if(time<0){minuti=" ";percenti="0"; $scope.live = false;}
         else if(time>0 && time<46){percenti=time; $scope.color = "p-green";}
         else if(time>47 && time<62){percenti="45"; $scope.color = "p-orange";}
         else if(time>62 && time<107){percenti=(time-15); $scope.color = "p-green"; }
         else if (time > 108 ){ percenti="90"; $scope.color = "p-red";}
         else { percenti="90";}
         //console.log(percenti);
         w = Math.floor(percenti/90*100);

         return w;
       }
      }

      $timeout(function(){
        $ionicLoading.hide();
      },timerhide);

      })

    .controller('LajmeCtrl', function($scope, $sce, $timeout, $ionicLoading, LajmeService) {
      ga_storage._trackPageview('#/app/lajmet', 'Vllaznia App Lajmet');
      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 100
	    });
        LajmeService.getAll(function(data) {
            $scope.lajme = data;
            $ionicLoading.hide();
        });
        $scope.doRefresh = function() {
          LajmeService.getAll(function(data) {
            $scope.lajme = data;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
       }
       $timeout(function(){
         $ionicLoading.hide();
       },5000);
    })

    .controller('LajmeDetCtrl', function($scope, $sce, $stateParams, $ionicLoading, LajmeService) {
        ga_storage._trackPageview('#/app/lajmi/'+ $stateParams.lajmiId+'', 'Vllaznia App Lajme Det');
        $scope.shareL = function(message, subject, image, link){
          ga_storage._trackEvent('Lajme', 'Share', subject);
          window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
        }
        $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 100
	});
        $scope.lajmi = LajmeService.getId($stateParams.lajmiId);
        $ionicLoading.hide();
    })

    .controller('NdeshjetCtrl', function($scope, $sce, $timeout, $ionicLoading, $ionicBackdrop, $ionicPopover, NdeshjetService) {
      ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet');

      $scope.clubId = 13;

      $scope.SezoneList = [
        { text: "Superliga 2014-15", value: 100 },
        { text: "Superliga 2013-14", value: 97 },
        { text: "Superliga 2012-13", value: 86 },
        { text: "Superliga 2011-12", value: 79 },
        { text: "Superliga 2010-11", value: 15 },
        { text: "Superliga 2009-10", value: 10 },
       ];


      $scope.sezoni_id = $scope.SezoneList[0].value;
      $scope.sezoni_text = $scope.SezoneList[0].text;

      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 500
	   });

     $ionicPopover.fromTemplateUrl('popover-template.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        //$scope.loadingIndicator.show;
        $ionicBackdrop.retain();
        NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
            //selectPopup.close();
            $scope.popover.hide();
            $ionicBackdrop.release();
        });
      };

     NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },5000);
      })

     .controller('NdeshjetDetCtrl', function($scope, $sce, $stateParams, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicLoading, NdeshjaService) {
       ga_storage._trackPageview('#/app/ndeshja/'+ $stateParams.ndeshjaId+'', 'Vllaznia App Ndeshja Det');
       var tani = new Date();
       var time = 1;
       var d1, minuti, percenti;
       //$scope.minuta = "minuta";
       $scope.loadingIndicator = $ionicLoading.show({
	        content: 'Loading Data',
	        animation: 'fade-in',
	        showBackdrop: true,
	        maxWidth: 200,
	        showDelay: 100
	    });
       $scope.percent = Math.floor(time/90*100);
       $scope.percenti=time;
       $scope.options = {
            animate:{
                duration:1000,
                enabled:true
            },
            barColor:'#cc3333',
            scaleColor:'#ddd',
            lineWidth:3,
            lineCap:'round',
            size:'60'
        };
       (function update() {
        $timeout(update, 59000);
        NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
            tani = new Date();
            $scope.item = data;
            $scope.content = data.kronika;
            //d1 = new Date('2014 05 13 21:00:00');
            d1 = new Date(data.orari);
            time = ((tani.getTime() - d1.getTime())/ (1000 * 60));
            //time = (tani-d1)/(1000*60);
            if(time<0){minuti=" ";percenti="0"; $scope.minuta = minuti;}
            else if(time>0 && time<46){mininuti=time; percenti=time; $scope.minuta = Math.floor(minuti);}
            else if(time>47 && time<62){minuti="HT"; percenti="45"; $scope.minuta = minuti;}
            else if(time>62 && time<107){minuti=(time-15); percenti=(time-15); $scope.minuta = Math.floor(minuti);}
            else {minuti="FT"; percenti="90"; $scope.minuta = minuti;}
            $scope.percent = Math.floor(percenti/90*100);
            //$scope.orari = ;
            //console.log(time+' '+percenti+' '+$scope.minuta);
            $ionicSlideBoxDelegate.update();
            $ionicScrollDelegate.resize();
            $ionicLoading.hide();
        });
       }());
       $scope.slideTo = function(index) {
          $ionicSlideBoxDelegate.slide(index);
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
          $ionicScrollDelegate.scrollTop(true);
       }
       $scope.doRefresh = function() {
         $scope.loadingIndicator = $ionicLoading.show({
	          content: 'Loading Data',
	           animation: 'fade-in',
	           showBackdrop: true,
	           maxWidth: 200,
	           showDelay: 100
	       });
         NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
            tani = new Date();
            $scope.item = data;
            $scope.content = data.kronika;
            d1 = new Date(data.orari);
            time = ((tani.getTime() - d1.getTime()) / 60000);
            //time = (tani-d1)/(1000*60);
            if(time<0){minuti=" ";percenti="0"; $scope.minuta = minuti;}
            else if(time>0 && time<46){minuti=time; percenti=time; $scope.minuta = Math.floor(minuti/90*100);}
            else if(time>48 && time<60){minuti="HT"; percenti="45"; $scope.minuta = minuti;}
            else if(time>60 && time<107){minuti=(time-15); percenti=(time-15); $scope.minuta = Math.floor(percenti/90*100);}
            else {minuti="FT"; percenti="90"; $scope.minuta = minuti;}
            $scope.percent = Math.floor(percenti/90*100);
            $scope.data = d1;
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop(true);
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });
       }
    })


    .controller('KlasifikimiCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicBackdrop, KlasifikimiService, $ionicPopover) {
     ga_storage._trackPageview('#/app/klasifikimi', 'Vllaznia App Klasifikimi');
     var titulliPop = "Zgjidh kampionatin";
     $scope.SezoneList = [
       { text: "Superliga 2014-15", value: 100 },
       { text: "Superliga 2013-14", value: 97 },
       { text: "Superliga 2012-13", value: 86 },
       { text: "Superliga 2011-12", value: 79 },
       { text: "Superliga 2010-11", value: 15 },
       { text: "Superliga 2009-10", value: 10 },
      ];

       $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	     });

       $ionicPopover.fromTemplateUrl('popover-template.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

       // $scope.sezoni = "2014-15";
       // $scope.sezoni_id = 100;
       $scope.sezoni_id = $scope.SezoneList[0].value;
       $scope.sezoni_text = $scope.SezoneList[0].text;

       KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });

        // An alert dialog for change seson
/**        $scope.selectKamp = function() {
          var selectPopup = $ionicPopup.alert({
            title: titulliPop,
            templateUrl: 'popup-template.html',
            scope: $scope,
          });
          selectPopup.then(function(res) {
            KlasifikimiService.getAllKlasifikimi($scope.sezoni_id, function(data) {
              $scope.items = data;
            });
          });
        };
**/
      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        $ionicBackdrop.retain();
        KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
            //selectPopup.close();
          //$scope.popover.hide();
            $ionicBackdrop.release();
        });
      };


        $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
        },6000);

    })

    .controller('KlasifikimiDetCtrl', function($scope, $stateParams, KlasifikimiService) {
        $scope.item = KlasifikimiService.get($stateParams.klasifikimiId);
    })

    .controller('LojtaretCtrl', function($scope, $timeout, $stateParams, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi', 'Vllaznia App Ekipi');
        $scope.sezoni_id =100;
        $scope.ekipiId =13;
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	      });
        EkipiService.getAllEkipi($scope.sezoni_id,$scope.ekipiId, function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    })

    .controller('LojtaretDetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi/'+ $stateParams.lojtariId+'', 'Vllaznia App Lojtari Det');
        //alert($stateParams.lojtariId);
        //$scope.playerID = 1;
       //$scope.item.pid = 1;
        //console.log($stateParams.lojtariId);
        $scope.anim="";
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 50
	      });
        $scope.item = EkipiService.get($stateParams.lojtariId);
        $ionicLoading.hide();
        //console.log($scope.item.pid);
        $scope.lojtariN = function(numri){
          if($scope.anim === "fadeInUp")
             $scope.anim = "fadeInDown";
         else
            $scope.anim = "fadeInUp";
          // $scope.anim="slideLeft";
           numri = $scope.item.pid +1;
           if(numri>25){numri=1;
            $scope.item.pid=1;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
           //console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $scope.lojtariP = function(numri){
           if($scope.anim === "fadeInUp")
             $scope.anim = "fadeInDown";
           else
            $scope.anim = "fadeInUp";
           numri = $scope.item.pid - 1;
           if(numri<1){numri=25;
           $scope.item.pid=25;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
          // console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $timeout(function(){
           $ionicLoading.hide();
         },6000);
    })


  .controller('KlubiCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
        ga_storage._trackPageview('#/app/klubi', 'Vllaznia App Klubi');
        $scope.title="Klubi";
        $scope.slideHasChanged = function(){
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.scrollTop(true);
         }
        $scope.slideTo = function(index) {
          if(index){
          $scope.title="Trofetë";
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.scrollTop(true);
          }
          else{
          $scope.title="Historia";
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.scrollTop(true);
          }
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.scrollTop(true);
       }
    })


    .controller('TvCtrl', function($scope) {
          //destroyBannerView();
          //admob.showBannerAd(false);
          //admob.showInterstitialAd();
          //showInterstitialAd();
          admob.showInterstitialAd();
          ga_storage._trackPageview('#/app/tv', 'Vllaznia App TV');
          $scope.browse = function(v) {
            ga_storage._trackEvent('TV', 'Play', v);
            //admob.showInterstitialAd();
            window.open(v, "_system", "location=yes");
          }
    })

   .controller('ForumiCtrl', function($scope, $timeout, $ionicLoading, ForumiService) {
        ga_storage._trackPageview('#/app/forumi', 'Vllaznia App Forumi');
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 10
	      });
        ForumiService.getAllPostimet(function(data) {
            $scope.posts = data;
            $ionicLoading.hide();
        });
        $scope.browse = function(v) {
          ga_storage._trackEvent('Forumi', 'Read', v);
          window.open(v, "_system", "location=yes");
        }
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    });
