const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {},
		actions: {

            // getActions().changeColor(0, "green");    setStore({ demo: demo });   const store = getStore();
			progressDisplay: (memo) => {

				const existingMemos = getStore().memos || [];
				const lastMemos = existingMemos.slice(-10);
				const newMemos = [...lastMemos, memo];
				setStore({memos: newMemos})

				//getActions().progressDisplay(memo);
			},

			getData: async () => {
				console.log("Let's get localStorage");										//logging
				getActions().progressDisplay("Let's get localStorage");
				const isStored = localStorage.getItem("dataStored");
				console.log("localStorage aquired");
				getActions().progressDisplay("localStorage aquired");
				if (isStored !== undefined && isStored !== null) {
					console.log(`store is being set from localStorage!`);
					getActions().progressDisplay(`store is being set from localStorage!`);
					await setTimeout (() => {}, 300)
					setStore(JSON.parse(isStored));
					console.log(`store was set from localStorage, this is it now: `);
					console.log(getStore())
				}else {
					console.log(`localStorage was empty, fetching data`);
					getActions().progressDisplay(`localStorage was empty, fetching data`);
					let allData = {};
					const types = ["people", "planets", "vehicles"];
					for (const type of types) { 
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
							  console.error(error.message);
							  getActions().progressDisplay(error.message);
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
					await setTimeout (() => {}, 300)
					setStore(allData);
					localStorage.setItem('dataStored', JSON.stringify(allData));
					console.log(`store and localStorage were updated with: `);
					console.log(allData);


			} //closing else statement
			}, //closing getData


			getData_2: async () => {
				console.log("Let's get localStorage"); 
				const isStored = localStorage.getItem("dataStored2");
				console.log("localStorage aquired");
				if (isStored !== undefined && isStored !== null) {
					console.log(`store is being set from localStorage2`);
					setStore(JSON.parse(isStored));
					console.log(`store was set from localStorage`);
				}else {
					let allData = {};
					const types = [ "species", "starships" ];
					for (const type of types) { 
						const typeResponse = await fetch(`https://www.swapi.tech/api/${type}?page=1&limit=999`);
						const typeData = await typeResponse.json();
						if (typeData.message !== "ok") {
							console.log(`Error fetching ${type}`);
							continue;
						  }
						console.log(`${type} fetched successfully!`);

						const detailPromises = typeData.results.map( async (item) => {
							const individualResponse = await fetch(item.url);
							const individualData = await individualResponse.json();
							if (individualData.message !== "ok") {
								console.log(`Error fetching ${item.name}`);
								return { uid: [item.uid], result: {...[item], fully_fetched: false} }
							  }
							  console.log(`${item.name} fetched`);
							  return individualData.result
						}) //closing detailPromises map
						
						const completeList = await Promise.all(detailPromises);
						allData[type] = completeList.reduce((accumulator, accumulated) => {
							accumulator[accumulated.uid] = accumulated;
							return accumulator
						}, {})//closing reduce
						console.log(`allData was updated with ${type}`)

					}//closing the first for loop
					//await setTimeout (() => {console.log("all Done!")}, 300)
					setStore(allData);
					localStorage.setItem('dataStored2', JSON.stringify(allData));
					console.log(`store and localStorage2 were updated with: `);
					console.log(allData);


			} //closing else statement
			} //closing getData_2
		}
	};
};

export default getState;