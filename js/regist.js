(function(){

	function readMasterData(){

		console.log('read master start');

		const masterPath = './data/master.json';

		$.ajax({
			url: masterPath,
			type:'GET',
			dataType: "json"
		}).done(function(result){
			let specialAbilities = result['abilities']["special-ability"];
			let numericalAbilities = result['abilities']["numerical-ability"];
			let pointSkillScore = result['point-skill'];


			let numericalAbilityBox = $('.numerical-abilities');
			let numericalAbility = $('.numerical-ability');

			for(let i = 1; i < numericalAbilities.length; i++){
				let target = numericalAbility.clone();
				target.find('label').text(numericalAbilities[i]['name']);
				let select = target.find('select');
				select.attr('name', 'id-' + i);
				select[0].dataset['id'] = i;
				select.addClass('n-ability');

				target.find('.description').text(numericalAbilities[i]['description']);

//				target.val(specialAbilities[i]['id']);

				numericalAbilityBox.append(target);
			}


			//===========================================

			let abilityBox = $('.special-abilities');
			let ability = $('.ability');

			for(let i = 1; i < specialAbilities.length; i++){
				let target = ability.clone();
				target[0].dataset["off"] = specialAbilities[i]['title'];
				target[0].dataset["on"] = specialAbilities[i]['title'];
				target[0].dataset['description'] = specialAbilities[i]['description'];
				target[0].dataset['type'] = specialAbilities[i]['type'];
				target.val(specialAbilities[i]['id']);

				if(specialAbilities[i]['append']){
					for(let j in specialAbilities[i]['append']){
						if(j = 'class'){
							for(let k = 0; k < specialAbilities[i]['append'][j].length; k++)
								target.addClass(specialAbilities[i]['append'][j][k]);
						}
					}
				}

				abilityBox.append(target);
			}

			setTooltip($('.ability'));


		}).fail(function(){
			alert('master data read error!');
			console.log(data);
		});

	};



	function setTooltip(element){
		element.each(function(){
			let target = $(this);

			new Tooltip(target, {
				title: target.data('description'),
			});

			target.click(function(){
				if(target.prop('checked')){
					target.addClass(target[0].dataset['type']);
				}else{
					target.removeClass(target[0].dataset['type'])
				}

			});
		});
	};


	$(document).ready(function(){
		let modal = $('.modal-box');
		$('.copy').click(function(){
			$('#result').select();
			document.execCommand('copy');
		});

		$('.close').click(function(){
			modal.hide();
		});

		readMasterData();

		$('#output').click(function(){

			let skillPoint = [];

			$('.skill-point').each(function(){
				let target = $(this);
				skillPoint.push(
					{
						"skill-name":target.find('.skill-name').val(),
						"skill-point":target.find('.skill-value').val()
					}
				);
			});

			//-----------------------------

			let numericalAbility = [];

			$('.n-ability').each(function(){
				let target = $(this);
				numericalAbility.push(
					{
						"id":target.data('id'),
						"value":target.val()
					}
				);
			});

			//-----------------------------

			let specialAbility = [];

			$('.ability').each(function(){

				let target = $(this);
				if(target.prop('checked')){

					specialAbility.push(target.val());
				}
			});

			let data = {
				"name": $('#name').val(),
				"belong-to": $('#belong-to').val(),
				"title": $('#title').val(),
				"avatar": $('#avator').val(),
				"style": {
					"desktop": $('#desktop').val(),
					"mobile": $('#mobile').val()
				},
				"point-skill" : skillPoint,
				"inherent-ability": {
					"name": $('#inherent-ability-name').val(),
					"description": $('#inherent-ability-value').val()
				},
				"abilities": {
					"numerical-ability": numericalAbility,
					"special-ability":specialAbility
				}
			};

			let result = JSON.stringify(data);
			console.log(result);
			$('#result').text(result);

			modal.show();

		});
	});

})();