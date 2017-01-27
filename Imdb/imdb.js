$(function () {
	var count = 1;

		function grabAndShow(api){
			$('.jumbotron').hide();
			searchBody.innerHTML = ""
			$('.result-box').show();
			$.getJSON(api)
				.done( function (data) {
					$.each(data.results, function(name,value) {

						var title = value.title;
						var poster = value.poster_path;
						var year = value.year;
						var overview = value.overview;
						var rating = value.vote_average;
						var release = value.release_date;
						displayMatches(title, overview, rating, release, poster)

						if (name === 19) {
							return false;
						}
					});
				});
		}

		function searchMovie() {
			var userSearch = $('#movieTitle').val();
			var queryApi = `https://api.themoviedb.org/3/search/movie?api_key=b508c79d1429c64e41a93c46a81d3825&query=${userSearch}`;
			grabAndShow(queryApi);
		}

		function findNowPlaying(){
			const nowPlayingApi = "https://api.themoviedb.org/3/movie/now_playing?api_key=b508c79d1429c64e41a93c46a81d3825";
			grabAndShow(nowPlayingApi);
		}
		function findUpcoming(){
			const upcomingApi = "https://api.themoviedb.org/3/movie/upcoming?api_key=b508c79d1429c64e41a93c46a81d3825";
			grabAndShow(upcomingApi);
		}
		function findTopRated(){
			const topRatedApi = "https://api.themoviedb.org/3/movie/top_rated?api_key=b508c79d1429c64e41a93c46a81d3825";
			grabAndShow(topRatedApi);
		}

		function findDiscover(){
			var selectedSort = $('#selectedSort').val();
			var selectedGenres = $('#genreSelect').val();
			var selectedAfterYear = $('#selectAfterYear').val();
			const discoverApi = `https://api.themoviedb.org/3/discover/movie?api_key=b508c79d1429c64e41a93c46a81d3825&language=en-US&page=${count}&release_date.lte=${selectedAfterYear}&sort_by=${selectedSort}&include_adult=false&include_video=false&with_genres=${selectedGenres}`;
			console.log(discoverApi);
			grabAndShow(discoverApi);
			$('.pager').show();
		}
		

		function findActor(){
			$('.jumbotron').hide();
			var inputActor = $('#inputActor').val().replace(/ /g, '+');
			const actorApi = `https://api.themoviedb.org/3/search/person?api_key=b508c79d1429c64e41a93c46a81d3825&query=${inputActor}`;
			console.log(actorApi);
			searchBody.innerHTML = "";
			$('.result-box').show();

			$.getJSON(actorApi)
				.done( function (data) {
						var actorName = data.results[0].name;
						var actorID = data.results[0].id;
						var actorMoviesApi = `https://api.themoviedb.org/3/person/${actorID}?api_key=b508c79d1429c64e41a93c46a81d3825&append_to_response=movie_credits`;
						console.log(actorMoviesApi);

						$.getJSON(actorMoviesApi)
							.done(function (data) {
								var biography = data.biography;
								var birthday = data.birthday;
								var gender = data.gender;
								var birthplace = data.place_of_birth;
								var picture = data.profile_path;
								var credit_list = data.movie_credits;
								console.log(birthday);

								$.each(credit_list.cast, function(i,e) {
								  var movieActedTitle = e.title;
								  console.log(movieActedTitle);
									var movieActedCharacter= e.character;
									var movieActedReleaseDate = e.release_date;
									var movieActedPoster = e.poster_path;
									var path = "actor-search";
									displayMatches(actorName,movieActedCharacter,movieActedTitle,movieActedReleaseDate,movieActedPoster,path,biography,birthday,gender,picture,birthplace);
									$('.jumbotron').show();
								});
							});

					});
		}

		function displayMatches(one,two, three, four, five, path, biography, birthday, gender, picture, birthplace ) {
			$("th.poster-field").addClass('pull-right');
			if(path ==='actor-search'){
				$('.resultbox-one').text('Actor');
				$('.resultbox-two').text('Character');
				$('.resultbox-three').text('Movie');
				$('.resultbox-four').text('Release Date');

				$('#actorHeader').html(one);
				$('#bioPara').html(biography);
				$('#birthdayHeader').html(`Born: <i>${birthday}</i>`);
				$('#actorImgBox').attr('src', `https://image.tmdb.org/t/p/w185/${picture}` ).show();
				(gender === 1) ? $('#genderBox').html("Female") : $('#genderBox').html("Male");
				$('#birthplaceBox').html(birthplace);


			}
				var html = `
						<tbody class = "searchBody">
							<tr>
								<td><b> ${one}</b></td>
								<td> ${two}</td>
								<td> ${three}</td>
								<td> ${four} </td>
								<td> <img src = "https://image.tmdb.org/t/p/w150/${five}" /> </td>
							</tr>
						</tbody>
				`;

			searchBody.innerHTML = searchBody.innerHTML + html;
		}

		const searchBody = document.querySelector('.searchBody');
		const posterField = document.querySelector('.poster-field');

		$('#searchMovie').click(searchMovie);
		$('#findNowPlaying').click(findNowPlaying);
		$('#findUpcoming').click(findUpcoming);
		$('#findTopRated').click(findTopRated);
		$('#discoverMovie').click(findDiscover);
		$('#searchActor').click(findActor);
		$('#next').click(function(){
			count++;
			findDiscover();
		});
		$('#previous').click(function(){
			count--;
			findDiscover();
		});
});
