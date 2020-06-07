'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function() {
    // Use the jQuery document ready signal to know when everything has been initialized
    $(document).ready(function() {
        // Tell Tableau we'd like to initialize our extension
        tableau.extensions.initializeAsync().then(function() {
/*
            // Fetch the saved sheet name from settings. This will be undefined if there isn't one configured yet
            const savedSheetName = tableau.extensions.settings.get('sheet');
            if (savedSheetName) {
                // We have a saved sheet name, show its selected marks
                loadSelectedMarks(savedSheetName);
            } else {
                // If there isn't a sheet saved in settings, show the dialog
                showChooseSheetDialog();
            }
*/
            const wsName = 'Opportunities';

            loadSelectedMarks(wsName);
/*
            const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
            worksheets.forEach((worksheet, i) => {
              const button = createButton(worksheet.name);
              $('#data_table_wrapper').append(button);
            });
*/
        });
    });

    function createButton(buttonTitle) {
        const button =
            $(`<button type='button' class='btn btn-default btn-block'>${buttonTitle}</button>`);

        return button;
    }

    // This variable will save off the function we can call to unregister listening to marks-selected events
    let unregisterEventHandlerFunction;

    function loadSelectedMarks(worksheetName) {
        // Remove any existing event listeners
        if (unregisterEventHandlerFunction) {
            unregisterEventHandlerFunction();
        }

        $('#selected_mark_opportunity').empty();
        $('#data_table_wrapper').empty();

        // Get the worksheet object we want to get the selected marks for
        const worksheet = getSelectedSheet(worksheetName);

        // Call to get the selected marks for our sheet
        worksheet.getSelectedMarksAsync().then(function(marks) {
            // Get the first DataTable for our selected marks (usually there is just one)
            const worksheetData = marks.data[0];
/*
            // Map our data into the format which the data table component expects it
            const data = worksheetData.data.map(function(row, index) {
                const rowData = row.map(function(cell) {
                    return cell.formattedValue;
                });

                return rowData;
            });

            const columns = worksheetData.columns.map(function(column) {
                return {
                    title: column.fieldName
                };
            });
*/

            // get opportunity id from active mark
            const opportunityIdColumn = worksheetData.columns.find(element => element.fieldName == 'ID');
            const opportunityId = worksheetData.data[0][opportunityIdColumn.index];

            $('#selected_mark_opportunity').text(opportunityId.value);

            console.log('Opportunity ID: ' + opportunityId.value);

            getOpportunityDetails(opportunityId);


/*
            //get underlying dataset
            worksheet.getUnderlyingDataAsync().then(dataTable => {

              const data = dataTable.data.map(function(row, index) {
                const rowData = row.map(function(cell) {
                  return cell.formattedValue;
                })

                return rowData;
              });

              const columns = dataTable.columns.map(function(column) {
                return {
                  title: column.fieldName
                };
              });

              // Populate the data table with the rows and columns we just pulled out
              populateDataTable(data, columns);

            });
*/
        });

        // Add an event listener for the selection changed event on this sheet.
        unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, function(selectionEvent) {
            // When the selection changes, reload the data
            loadSelectedMarks(worksheetName);
        });
    }

    const accessTokenUrl = `https://login.salesforce.com/services/oauth2/token`;

    const username = `rick.pearson@springml.dataload`;
    const password = `j51Ui9MWGnl1Kwu5%o#8`;
    const securityToken = `RsqZxY0F6nR7T4aoBoLOCt4HF`;
    const clientId = `3MVG9dZJodJWITSuZ3nLZQfWxRguTTFzK16QIpJGUnkaFPISbBZ6u9ed6aFuT6v4g0mu9iR9PrfsIwFZLpMwG`;
    const clientSecret = `9AD38B5C220C11055D41567260A9B51BB5FEE907B4721EB78AEA1259F63E62F8`;
    const bearer = token => `Bearer ${token}`;

    const corsProxy = `https://sfdc-cors.herokuapp.com/`;
    const appBaseUrl = `https://sml-saas.my.salesforce.com`;
    const queryResPath = query => `/services/data/v48.0/query?q=${query}`;
    const query = id => `Select Id,AccountId,Account.Name,Account.BillingAddress,CreatedDate,Account.Industry,Account.Phone,Amount,CloseDate,Contract_End_Date__c,Description,ForecastCategory,ForecastCategoryName,HasOpenActivity,HasOpportunityLineItem,HasOverdueTask,IsClosed,IsWon,LeadSource,Name,NextStep,Probability,StageName,Type FROM Opportunity Where Id='${id}'`;

    let bearerToken = '00D0b000000vzXw!AQYAQJ2UCHPNlVF7fNG0Bvm0u5wvmKOuidHGZgPWG6jl5DJHeL5g0xmaNMqmZrqMPVNCDASEDLZ13ax4PHxv_reBjJ7MPKfu';

    function getBearerToken() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "BrowserId=B28g30UTEeqh1xv8NedS5A");

      var urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "password");
      urlencoded.append("username", "rick.pearson@springml.dataload");
      urlencoded.append("password", "j51Ui9MWGnl1Kwu5%o#8RsqZxY0F6nR7T4aoBoLOCt4HF");
      urlencoded.append("client_id", "3MVG9dZJodJWITSuZ3nLZQfWxRguTTFzK16QIpJGUnkaFPISbBZ6u9ed6aFuT6v4g0mu9iR9PrfsIwFZLpMwG");
      urlencoded.append("client_secret", "9AD38B5C220C11055D41567260A9B51BB5FEE907B4721EB78AEA1259F63E62F8");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
//        mode: 'no-cors'
      };

      fetch("https://sfdc-cors.herokuapp.com/services/oauth2/token", requestOptions)
        .then(response => response.text())
        .then(result => console.log("Bearer Result: " + result))
        .catch(error => console.log('error', error));

    }

    function getOpportunityDetails(id) {

      //if(!bearerToken)
      //bearerToken = getBearerToken();
        console.log("Bearer: " + getBearerToken());
    }

    function none(id) {
      var headers = new Headers();
      headers.append("Authorization", bearer(bearerToken));

      var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      };

      /* to fix the CORS issue; goto SF->search for 'CORS'; add your domain;
       * see https://help.salesforce.com/articleView?id=extend_code_cors.htm&type=5
       * orgiginally I just used a cors proxy;
       * see https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
       */
      const url = appBaseUrl + queryResPath(encodeURIComponent(query(id.value)));
      console.log(url);
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          $('#data_table_wrapper').text(JSON.stringify(result, null, 2));
        })
        .catch(error => console.log('error', error));

    }

    function populateDataTable(data, columns) {
        // Do some UI setup here: change the visible section and reinitialize the table
        $('#data_table_wrapper').empty();

        if (data.length > 0) {
            $('#no_data_message').css('display', 'none');
            $('#data_table_wrapper').append(`<table id='data_table' class='table table-striped table-bordered'></table>`);

            // Do some math to compute the height we want the data table to be
            var top = $('#data_table_wrapper')[0].getBoundingClientRect().top;
            var height = $(document).height() - top - 130;

            const headerCallback = function(thead, data) {
                const headers = $(thead).find('th');
                for (let i = 0; i < headers.length; i++) {
                    const header = $(headers[i]);
                    if (header.children().length === 0) {
                        const fieldName = header.text();
                        const button = $(`<a href='#'>${fieldName}</a>`);
                        button.click(function() {
                            filterByColumn(i, fieldName);
                        });

                        header.html(button);
                    }
                }
            };

            // Initialize our data table with what we just gathered
            $('#data_table').DataTable({
                data: data,
                columns: columns,
                autoWidth: false,
                deferRender: true,
                scroller: true,
                scrollY: height,
                scrollX: true,
                headerCallback: headerCallback,
                dom: "<'row'<'col-sm-6'i><'col-sm-6'f>><'row'<'col-sm-12'tr>>" // Do some custom styling
            });
        } else {
            // If we didn't get any rows back, there must be no marks selected
            $('#no_data_message').css('display', 'inline');
        }
    }

    function getSelectedSheet(worksheetName) {
        if (!worksheetName) {
            worksheetName = tableau.extensions.settings.get('sheet');
        }

        // Go through all the worksheets in the dashboard and find the one we want
        return tableau.extensions.dashboardContent.dashboard.worksheets.find(function(sheet) {
            return sheet.name === worksheetName;
        });
    }

})(); // end outer anonymous function
