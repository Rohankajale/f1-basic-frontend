const loadDrivers = async () => {
    const urlDrivers = 'https://api.openf1.org/v1/drivers?session_key=latest'
    const urlChampionshipDrivers = 'https://api.openf1.org/v1/championship_drivers?session_key=latest'
        
    const [response1, response2] = await Promise.all([fetch(urlDrivers), fetch(urlChampionshipDrivers)])

    const drivers = await response1.json()
    const championshipDrivers = await response2.json()

    const combinedData = drivers.map(driver => {
        const championshipDriver = championshipDrivers.find(champDriver => champDriver.driver_number === driver.driver_number)
        return { ...driver, positionCurrent: championshipDriver.position_current, pointsCurrent: championshipDriver.points_current }
    })

    console.log(combinedData)

    const sortedCombinedData = [...combinedData].sort(
        (a, b) => a.positionCurrent - b.positionCurrent
    ) 

    console.log(sortedCombinedData)

    const container = document.getElementById('drivers')

    sortedCombinedData.forEach(data => {
        const row = document.createElement('tr')
        row.className = 'border-b hover:bg-gray-100 transition'
        row.style.backgroundColor = `#${data.team_colour}`

        const positionCurrentTd = document.createElement('td')
        positionCurrentTd.className = 'py-3 px-4'
        positionCurrentTd.textContent = `${data.positionCurrent} (${data.name_acronym})`

        const imgTd = document.createElement('td')
        imgTd.className = 'py-3 px-4'
        const img = document.createElement('img');
        img.className = 'w-12 h-12 object-cover rounded-full min-w-[48px]';
        img.src = data.headshot_url
        imgTd.appendChild(img);

        const nameTd = document.createElement('td')
        nameTd.className = 'py-3 px-4'
        nameTd.textContent = `${data.full_name} (#${data.driver_number})`

        const pointsCurrentTd = document.createElement('td')
        pointsCurrentTd.className = 'py-3 px-4'
        pointsCurrentTd.textContent = data.pointsCurrent

        const teamNameTd = document.createElement('td')
        teamNameTd.className = 'py-3 px-4 text-gray-600'
        teamNameTd.textContent = data.team_name

        row.appendChild(positionCurrentTd)        
        row.appendChild(imgTd)
        row.appendChild(nameTd)
        row.appendChild(pointsCurrentTd)        
        row.appendChild(teamNameTd)

        container.appendChild(row)
    });

}

loadDrivers()


