const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {},
		actions: {

            // getActions().changeColor(0, "green");    setStore({ demo: demo });   const store = getStore();
			
			progressDisplay: (memo) => {
				if (memo !== `exit screen`) {
					const existingMemos = getStore().memos || [];
					const lastMemos = existingMemos.slice(-10);
					const newMemos = [...lastMemos, memo];
					setStore({memos: newMemos})
				} else {
					setStore({memos: [memo]})
				}	
				//getActions().progressDisplay(memo); catch
			},

			getData: async (fetching, storage) => {
				console.log("Let's get localStorage");
				const isStored = localStorage.getItem(storage);
				console.log("localStorage aquired");
				if (isStored !== undefined && isStored !== null) {
					console.log(`store is being set from localStorage!`);
					setStore(JSON.parse(isStored));
					console.log(`store was set from localStorage, this is it now: `);
					console.log(getStore())
					getActions().progressDisplay(`exit screen`);
				}else {
					console.log(`localStorage was empty, fetching data`);
					getActions().progressDisplay(`localStorage was empty, fetching data`);
					let allData = {};

					for (const type of fetching) { 
						const typeResponse = await fetch(`https://www.swapi.tech/api/${type}?page=1&limit=999`);
						const typeData = await typeResponse.json();
						if (typeData.message !== "ok") {
							console.log(`Error fetching ${type}`);
							getActions().progressDisplay(`Error fetching ${type}`);
							continue;
						  }
						console.log(`${type} fetched successfully!`);
						getActions().progressDisplay(`${type} fetched successfully!`);

						const detailPromises = typeData.results.map(async (item) => {
							try {
							  const individualResponse = await fetch(item.url);
							  const individualData = await individualResponse.json();
							  if (individualData.message !== "ok") {
								throw new Error(`Error fetching ${item.name}`);
							  }
							  console.log(`${item.name} fetched successfully`);
							  getActions().progressDisplay(`${item.name} fetched successfully`);
							  return individualData.result;
							} catch (error) {
								getActions().progressDisplay(error.message);
							  	console.error(error.message);
							  return { uid: item.uid, properties: {fully_fetched: false, error: "no data sent by api", ...item} };
							}
						  }); //closing detailPromises map
						
						const completeList = await Promise.all(detailPromises);
						allData[type] = completeList.reduce((accumulator, accumulated) => {
							accumulator[accumulated.uid] = accumulated;
							return accumulator
						}, {})//closing reduce
						console.log(`allData was updated with ${type}`)
						getActions().progressDisplay(`allData was updated with ${type}`);

					}//closing the first for loop
					console.log("all Done!")
					getActions().progressDisplay("all Done!");
					await new Promise(resolve => setTimeout (resolve, 1500));
					setStore(allData);
					localStorage.setItem(storage, JSON.stringify(allData));
					console.log(`store and localStorage were updated with: `);
					console.log(allData);
					getActions().progressDisplay(`exit screen`);

			} //closing else statement
			}, //closing getData

			prepareKey: ([key,value]) => {
				const prop = [];
				for (const char of key) {
					if (prop.length === 0) {
						prop.push(char.toUpperCase())
					} else if (char === "_") {
						prop.push(" ")
					} else if (prop[prop.length -1] === " ") {
						prop.push(char.toUpperCase());
					} else {
						prop.push(char)
					}
				}
				return `${prop.join("")}: ${value}`

			},  //closing prepareKey

			set_getDetails: (payload) => {

			if (payload) {
				console.log(`set_getDetails: setting store with :`)
				console.log({"details": payload});
				setStore({"details": payload});
				console.log(`set_getDetails: setting localStorage with details`)
				localStorage.setItem("details", JSON.stringify(payload))
			} else{
				if (getStore().details) {
					console.log(`set_getDetails: getting details from store`)
					return getStore().details
				} else {	
					console.log(`set_getDetails: getting details from localStorage`)
					const stored = localStorage.getItem("details")
						if (stored) {
							console.log("set_getDetails: setting store and returning from local storage")
							const data = JSON.parse(stored)
							setStore({"details": data});
							return data
						} else {
							console.log("set_getDetails: there was nothing in store or localStorage")
							return {bad_status: `No details available. Go back home and click on "Learn more!"`}
						}

				}
			}  //closing else

			},  //closing set_getDetails

			set_get_deleteFavorites: (action, payload) => {

				if (action === "add") {
					console.log(`set_get_deleteFavorites: adding ${payload.name} to favorites with:`)
					console.log({"favorites": payload});
					const currentFavorites = getStore().favorites;
					setStore({"favorites": currentFavorites ? [...currentFavorites, payload] : [payload]});
					console.log(`set_get_deleteFavorites: setting localStorage with favorites`)
					localStorage.setItem("favorites", JSON.stringify(getStore().favorites))
					console.log(`set_get_deleteFavorites: new favorites:`)
					console.log(getStore().favorites);

				} else if (action === "delete") {
					console.log(`set_get_deleteFavorites: deleting ${getStore().favorites[payload].name} from favorites`)
					const currentFavorites = getStore().favorites;
					const newFavsorites = currentFavorites.filter((fav, index) => index !== payload);
					setStore({"favorites": newFavsorites});
					console.log(`set_get_deleteFavorites: setting localStorage with new favorites:`)
					console.log(newFavsorites)
					localStorage.setItem("favorites", JSON.stringify(newFavsorites))
					console.log(`set_get_deleteFavorites: new favorites:`)
					console.log(getStore().favorites);

				}else if (action === "get") {
					if (getStore().favorites) {
						console.log(`set_get_deleteFavorites: getting favorites from store`)
						return getStore().favorites
					} else {	
						console.log(`set_get_deleteFavorites: getting favorites from localStorage`)
						const stored = localStorage.getItem("favorites")
							if (stored) {
								console.log("set_get_deleteFavorites: setting store and returning from local storage")
								const data = JSON.parse(stored)
								setStore({"favorites": data});
								return data
							} else {
								console.log("set_get_deleteFavorites: there was no favorites in store or localStorage")
								return []
							}
	
					}
				}  //closing else
	
				},  //closing set_get_deleteFavorites

		}  //closing actions
	};  //closing return
};  //closing getState

export default getState;