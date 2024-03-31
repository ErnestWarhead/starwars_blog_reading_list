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
				getActions().progressDisplay("localStorage aquired");
				if (isStored !== undefined && isStored !== null) {
					console.log(`store is being set from localStorage!`);
					getActions().progressDisplay(`Seting store from localStorage!`);
					await new Promise(resolve => setTimeout (resolve, 2000));
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
							  return { uid: item.uid, result: {...item, fully_fetched: false} };
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
					await new Promise(resolve => setTimeout (resolve, 2000));
					setStore(allData);
					localStorage.setItem(storage, JSON.stringify(allData));
					console.log(`store and localStorage were updated with: `);
					console.log(allData);
					getActions().progressDisplay(`exit screen`);

			} //closing else statement
			}, //closing getData

		}  //closing actions
	};  //closing return
};  //closing getState

export default getState;