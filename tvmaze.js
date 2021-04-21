/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the se+archShows api.  Remove
  // hard coded data.

  // get() this first for a show id http://api.tvmaze.com/search/shows?q=girls
  //then use the abv id here to http://api.tvmaze.com/shows/${showid}/episodes
  const res = await axios.get('http://api.tvmaze.com/search/shows', { params: {q: query} });
 
  //use the map method to map all shows coming from the search into an array

  let showsArr = res.data;
  showsArr = showsArr.map(e => {
    return{ 
    id: e.show.id,
    name: e.show.name,
    summary: e.show.summary,
    image: e.show.image.medium ? e.show.image.medium : ' https://tinyurl.com/tv-missing'
    }
  });


  return showsArr;
}

/*    { what to return like for the abv f()
      id: 1767,
      name: "The Bletchley Circle",
      summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
      image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }*/

  //make a loop, go thru array and pick the highest score, or just pick the first relevancy since it's the score
  //const showID = res.data[0].show.id;
 // const showEPs = await axios.get(`http://api.tvmaze.com/shows/${showID}/episodes`);
  //console.log(showEPs)



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>

             <div>
              <button class='epbtn'>Episodes</button>             
             </div>
           </div>
         </div> 
         
       </div>
      `);

    $showsList.append($item);
  }

  //add evt listener to episodes btn to list episodes

}


/**evt listener on episodes btn */
$('#shows-list').on('click', '.epbtn', async function() {
  
  const id = $(this).closest('[data-show-id]').data('show-id');

  const episodes = await getEpisodes(id);//wait for this query to return
  populateEpisodes(episodes);

});
/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const epList = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(epList.data);

  return epList.data;
  // TODO: return array-of-episode-info, as described in docstring above
}

/**populate episodes on UI */
function populateEpisodes(epArr){
  document.querySelector('#episodes-area').removeAttribute('style');

  //make a loop that ataches each ep to dom
  for(let x of epArr){
    $('#episodes-list').append(`<li>${x.name} (Season ${x.season} Episode ${x.number})</li>`);
  }
}





// populateEpisodes([{name: 'name', season: 2, number: 5},
// {name: 'name', season: 2, number: 5},
// {name: 'name', season: 2, number: 5}]); //test code