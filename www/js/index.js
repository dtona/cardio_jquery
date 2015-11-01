/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var currentPage = 0,        
    curseStatus = '',    
    btnNext,
    btnPrev,
    content,
    menuHor,
    layer,
    app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        $(function() {                                

            resize();

            btnNext = $('#btnNext');
            btnPrev = $('#btnPrev');
            content = $('#main');
            menuHor = $('.menuHor:first');      
            layer = $('div#layer');

            if (connection) {
                
                if (getAPI()) {
                    //checkProgress();
                } else {
                    errorAPI();
                    goPage(0);
                }

            } else {
                goPage(0);
                checkProgress();
            }

            $('#btnMenu').click(function() {
                btnMenu();
            });

            $('.w3-ul li').click(function(e) {
                e.preventDefault();         
                var href = $('a', this).attr('href');           
                href = href.substr(1, href.length -1);
                if (href.length == 0) {
                    //alert('No tiene link');
                    //console.log('No tiene link');
                } else {                

                    var index = findWithAttr(course.pages, 'url', href + '.html');              

                    if (index != undefined) {                   
                        goPage(index);      
                        btnMenu();
                    } else {
                        //alert('undefined');
                        //console.log('undefined');
                    }
                }
            });

            $('#btnNext').click(function() {            
                if ((currentPage + 1) <= lastPage) {
                    ++currentPage;                              
                    loadContent();
                } else {
                    //console.log('Error - Ya no hay más páginas después');
                }
            });

            $('#btnPrev').click(function(){
                if (currentPage > 0) {
                    --currentPage;
                    loadContent();
                } else {
                    //console.log('Error - Ya no hay más páginas antes');
                }
            });    

            $(window).resize(function(){
                resize();
            });     

            $('div#layer').click(function() {
                btnMenu();
            });     
        });                    
    }
};

app.initialize();

function findWithAttr(array, attr, value) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}

function resize() {     
    var headerHeight = $('#template-up').height();
    var footerHeight = $('#template-down').outerHeight();
    var mainHeight = $(window).height() - headerHeight - footerHeight;
    $('#main').css('height', mainHeight);
    $('#main').css('margin-top', headerHeight);
}

function btnMenu() {
    if (menuHor.is(':hidden')) {
        menuHor.show(0);
        layer.show(0);
    } else {
        menuHor.hide(0);
        layer.hide(0);
    }
}   

function loadContent() {        
    
    if (typeof localStorage.visitedPages == 'undefined' || (localStorage.visitedPages).length == 0) {
        localStorage.visitedPages = course.pages[currentPage].url + ',';
    } else {
        var array = (localStorage.visitedPages).split(',');
        if (array.indexOf(course.pages[currentPage].url) === -1) {
            array.push(course.pages[currentPage].url);
            localStorage.visitedPages = array;
        }
    }           

    content.html('<iframe name="com" id="com" src="' + contentPath + course.pages[currentPage].url + '" frameborder="0" scrolling="no" border="0"></iframe>');      
    //$('#com').mCustomScrollbar();
    updateTracking();       
    checkProgress();
}

function checkProgress() {      
    if (typeof localStorage.lastPageVisited != 'undefined' && Number(localStorage.lastPageVisited) > 0) {
        //$('#btnMenu').show(0);
        var array = $('ul.w3-ul').find('li a');         
        //alert('visitedPages>>' + localStorage.visitedPages);
        var visitedPages = (localStorage.visitedPages).split(',');                      
        var x;
        //alert('visitedPages.length>>' + visitedPages.length);    
        //alert('cuantos elementos hay en menu>>' + array.length);        
        
        for (var i = 0, len = array.length; i < len; i++) {             
            x = ($(array[i]).attr('href')).substr(1, ($(array[i]).attr('href')).length - 1);
            if (x.length > 0) {
                x = x + '.html';        
                if (visitedPages.indexOf(x) === -1) {
                    $(array[i]).hide(0);
                } else {
                    $(array[i]).show(0);
                }
            } else {
                $(array[i]).show(0);
            }
        }
    }
}

function goPage(pageID) {

    /*
    Parece que esto ya no se ocupa
    if (currentPage != pageID) {
        lastPage = currentPage;
    }*/

    currentPage = pageID;
    loadContent();
}

function reLoad() {
    goPage(currentPage);
}

function goHome() {

    if (currentPage != 0) {
        goPage(0);
    }
}

function updateTracking() {         
    if (Number(localStorage.lastPageVisited) < currentPage) {
        localStorage.lastPageVisited = currentPage;
    }       
    
    //if (connection) {
        /*// enviar aquí el 'lesson_location'
        if (!curseCompleted) {
            if (currentPage == course.pages.length - 1) {
                
                // enviar aquí el 'completed'
                curseCompleted = true;

            } else {
                // enviar aquí el 'incomplete'
            }
        }*/         
        
        //var success = lmsCall('Commit');
        //if (!success){
        //    errorAPI();
        //}

        if (currentPage == lastPage) {              
            localStorage.courseCompleted = 'true';
            $('#btnMenu').show(0);            
        }
    //}
    
    //Actualización de los botones de navegación
    if (currentPage < lastPage) {           

        if (!navegationBlock) {             
            btnNext.show(0);
        }

    } else {            
        btnNext.hide(0);
    }

    if (typeof localStorage.courseCompleted != 'undefined' && localStorage.courseCompleted == 'true') {
        $('#btnMenu').show(0);
    }

    if (currentPage > 0 && typeof localStorage.courseCompleted != 'undefined' && localStorage.courseCompleted == 'true') {        
        btnPrev.show(0);
    } else {
        btnPrev.hide(0);
    }
}

function errorAPI(){
    if (mostrarAlertas) {
        alert('Se ha detectado un problema de comunicación con el LMS.\nSu progreso no podrá seguir siendo registrado.\nPor favor cierre el curso y vuelva a intentarlo.');
    }
    //console.log('Error de conexión');
}