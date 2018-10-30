(function(){

	let abilities = {};
	let pointSkillScore = {};

	const parameter = 'member';
	const memberList = [];


    function getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /**
     * マウスオーバーしたときに説明文を出す「ToolTip」を設定する。
     * @param element
     */
    function setTooltip(element){
        element.each(function(){
            let target = $(this);

            new Tooltip(target, {
                title: target.data('detail'),
            });
        });
    };

    function readMasterData(member){

        console.log('read master start');

        const masterPath = './data/master.json';

        if(!member){
            member = parameter;
        }
        $.ajax({
            url: masterPath,
            type:'GET',
            dataType: "json"
        }).done(function(result){
            abilities = result['abilities'];
            pointSkillScore = result['point-skill'];

            readMemberData(member);

        }).fail(function(){
            alert('master data read error!');
            console.log(data);
        });

    };


    function readMemberData(member){
        console.log('read member start');

        setMemberList();


        const memberPath = './data/member/' + member + '.json';

        $.ajax({
            url: memberPath,
            type:'GET',
            dataType: "json"
        }).done(function(result){
            setDataToDom(result);
        }).fail(function(result){
            alert('member data read error!');
            console.log(result);
        });
    };

    function setDataToDom(data){
        let profile = $('.profile');

        // 名前
        profile.find('.name').text( data['name'] );
        // 所属
        profile.find('.belong-to').text( data['belong-to'] );
        // 肩書
        profile.find('.title').text( data['title'] );
        // アバター画像
        profile.find('.avatar').attr('src', data['avatar'] );
        // スタイル
        profile.find('.style-desktop').text(data['style']['desktop'] );
        profile.find('.style-mobile').text(data['style']['mobile'] );

        profile = null;

        //===========================================

        let pointSkills = $('.point-skills');
        let template = $('.point-skill');

        for(let i =0; i < data['point-skill'].length; i++){
            let target = template.clone();
            target.find('.skill-point').text(data['point-skill'][i]['skill-point']);
            target.find('.skill-name').text(data['point-skill'][i]['skill-name']);

            let score = judgeScore(data['point-skill'][i]['skill-point']);
            target.find('.skill-score').addClass('score-'+score.toLowerCase()).text(score);

            pointSkills.append(target);
        }

        pointSkills = null;

        //===========================================

        let inherentAbility = $('.inherent-ability');

        inherentAbility.find('.ability-name').text(data['inherent-ability']['name'] );
        inherentAbility.find('.ability-detail').children('.underline').text(data['inherent-ability']['description'] );

        inherentAbility = null;

        //===========================================

        let numericalAbilities = $('.numerical-abilities');
        template = $('.numerical-ability');

        for(let i =0; i < data['abilities']['numerical-ability'].length; i++){
            let target = template.clone();
            let nData = data['abilities']['numerical-ability'][i];
            let nAbility = abilities['numerical-ability'][nData['id']];

            target.find('.ability-name').text(nAbility['name']);
            target.addClass('level-' + nData['value']);
            target[0].dataset.detail = nAbility['description'];
            target.find('.ability-value').text(nData['value']);

            numericalAbilities.append(target);
        }

        numericalAbilities = null;

        //===========================================

        let specialAbilities = $('.special-abilities');
        template = $('.special-ability');

//        for(let i =0; i < data['abilities']['special-ability'].length; i++){
        for(let i = 1; i < abilities['special-ability'].length; i++){

            let target = template.clone();
            let id, ability, detail;

            if( searchAbility(i, data['abilities']['special-ability']) ){
                id = i;
                ability = abilities['special-ability'][id];
                detail = 'No.'+id+' '+ability['description'];

            }else{
                id = 0;
                ability = abilities['special-ability'][0];
                detail = '';
            }

            target.text(ability['title']);
            target.addClass(ability['type']);
            target[0].dataset.detail = detail;

            if(ability['append']){
                for(let j in ability['append']){
                    if(j = 'class'){
                        for(let k = 0; k < ability['append'][j].length; k++)
                            target.addClass(ability['append'][j][k]);
                    }
                }
            }

            specialAbilities.append(target);
        }

        specialAbilities = null;

        //===========================================

        setAction();
    }

    function setMemberList(){
        let target = $('.members');

		let dir = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/';

        for(let i = 0; i < memberList.length; i++){
            let anchor = $('<a>')
                .attr('href', dir + '?' + parameter + '=' + memberList[i]['key'])
                .text(memberList[i]['name'])
            ;

            target.append(anchor);
        }
    }

    function judgeScore(point){

        for(let i =0; i < pointSkillScore.length; i++){
            if(point >= pointSkillScore[i]['border']){
                return pointSkillScore[i]['score'];
            }
        }

        return 'Z';
    }


    function searchAbility(master_id, data){
        for(var i in data){
            if(data[i] == master_id){
                return true;
            }
        }

        return false;
    }


    function setAction(){
        setTooltip($('.numerical-ability'));
        setTooltip($('.special-ability'));
        setTooltip($('.technical-ability'));

        $('.ajax-modal').hide();
    };


    //Start

    $( document ).ready(function() {

        let person = getParam('member');

        setTimeout(function(){
            readMasterData(person);
        }, 500);




        $('.box').hide();
        $('.ability-box').show();

        $('.tab').click(function(){
            $('.box').hide();
            $('.tab').removeClass('tab-active');

            let target = $(this).data('target');

            $('.' + target).show();

            $(this).addClass('tab-active');

            return false;
        });



    });
})();


