import"../chunks/DsnmJJEf.js";import{al as f,a1 as v,a3 as S,a2 as u,t as A,M as i,an as j,Q as H,aE as ke,am as P,$ as V,a0 as X,a4 as oe,a5 as ue,ba as xe,O as Se}from"../chunks/BFZ9LkA7.js";import{b as p,f as w,c as T,t as Ce}from"../chunks/Crl5oi66.js";import{a as M,f as ze,e as ce}from"../chunks/cK4QeKDK.js";import{e as E,i as U,b as Me,s as de,c as Te,d as Ae}from"../chunks/C-mfHQaF.js";import{e as re}from"../chunks/zvhvVCcK.js";import{c as ne}from"../chunks/CIOv8Qt0.js";import{s as ae,p as Q}from"../chunks/C6ZMLTPy.js";import{S as qe,c as Ie}from"../chunks/D2P01E5R.js";import{i as Y}from"../chunks/BAUbFhtF.js";import{h as W}from"../chunks/B8s1EM68.js";import{s as Re}from"../chunks/i_QrQNzF.js";import{b as De}from"../chunks/Dt1A_N_I.js";import"../chunks/DlOzM7pa.js";var he={},K={},ee=34,N=10,te=13;function me(r){return new Function("d","return {"+r.map(function(t,e){return JSON.stringify(t)+": d["+e+'] || ""'}).join(",")+"}")}function je(r,t){var e=me(r);return function(a,o){return t(e(a),o,r)}}function pe(r){var t=Object.create(null),e=[];return r.forEach(function(a){for(var o in a)o in t||e.push(t[o]=o)}),e}function z(r,t){var e=r+"",a=e.length;return a<t?new Array(t-a+1).join(0)+e:e}function Be(r){return r<0?"-"+z(-r,6):r>9999?"+"+z(r,6):z(r,4)}function He(r){var t=r.getUTCHours(),e=r.getUTCMinutes(),a=r.getUTCSeconds(),o=r.getUTCMilliseconds();return isNaN(r)?"Invalid Date":Be(r.getUTCFullYear())+"-"+z(r.getUTCMonth()+1,2)+"-"+z(r.getUTCDate(),2)+(o?"T"+z(t,2)+":"+z(e,2)+":"+z(a,2)+"."+z(o,3)+"Z":a?"T"+z(t,2)+":"+z(e,2)+":"+z(a,2)+"Z":e||t?"T"+z(t,2)+":"+z(e,2)+"Z":"")}function Ee(r){var t=new RegExp('["'+r+`
\r]`),e=r.charCodeAt(0);function a(n,h){var b,y,m=o(n,function(x,k){if(b)return b(x,k-1);y=x,b=h?je(x,h):me(x)});return m.columns=y||[],m}function o(n,h){var b=[],y=n.length,m=0,x=0,k,C=y<=0,q=!1;n.charCodeAt(y-1)===N&&--y,n.charCodeAt(y-1)===te&&--y;function F(){if(C)return K;if(q)return q=!1,he;var J,L=m,D;if(n.charCodeAt(L)===ee){for(;m++<y&&n.charCodeAt(m)!==ee||n.charCodeAt(++m)===ee;);return(J=m)>=y?C=!0:(D=n.charCodeAt(m++))===N?q=!0:D===te&&(q=!0,n.charCodeAt(m)===N&&++m),n.slice(L+1,J-1).replace(/""/g,'"')}for(;m<y;){if((D=n.charCodeAt(J=m++))===N)q=!0;else if(D===te)q=!0,n.charCodeAt(m)===N&&++m;else if(D!==e)continue;return n.slice(L,J)}return C=!0,n.slice(L,y)}for(;(k=F())!==K;){for(var B=[];k!==he&&k!==K;)B.push(k),k=F();h&&(B=h(B,x++))==null||b.push(B)}return b}function s(n,h){return n.map(function(b){return h.map(function(y){return l(b[y])}).join(r)})}function d(n,h){return h==null&&(h=pe(n)),[h.map(l).join(r)].concat(s(n,h)).join(`
`)}function _(n,h){return h==null&&(h=pe(n)),s(n,h).join(`
`)}function g(n){return n.map(c).join(`
`)}function c(n){return n.map(l).join(r)}function l(n){return n==null?"":n instanceof Date?He(n):t.test(n+="")?'"'+n.replace(/"/g,'""')+'"':n}return{parse:a,parseRows:o,format:d,formatBody:_,formatRows:g,formatRow:c,formatValue:l}}var Ue=Ee(","),Fe=Ue.parse,Pe=w('<section id="demo-link"><h2>Link</h2> <p><a href="elements">Default element styles demo</a></p> <p><a href="fonts">Pudding-hosted font previews</a></p> <p><a href="ui">BitsUI styled components</a></p></section>');function We(r){var t=Pe();p(r,t)}var Je=w('<section id="demo-image"><h2>Image</h2> <p>img tag</p> <img src="../assets/demo/test.jpg" alt="cat" class="svelte-b56t42"/> <p>background image</p> <div class="svelte-b56t42"></div></section>');function Le(r){var t=Je();p(r,t)}var Oe=w('<section id="demo-element"><h2>Dynamic Svelte Element</h2> <!></section>');function Ge(r){const t=[{tag:"h3",text:"I am a h3 tag."},{tag:"p",text:"I am p tag."}];var e=Oe(),a=f(v(e),2);E(a,17,()=>t,U,(o,s)=>{let d=()=>i(s).tag,_=()=>i(s).text;var g=T(),c=S(g);re(c,d,!1,(l,n)=>{var h=Ce();A(()=>M(h,_())),p(n,h)}),p(o,g)}),u(e),p(r,e)}var Ne=w("<p> </p>");function Qe(r,t){var e=Ne(),a=v(e);u(e),A(()=>M(a,`I am component A and my favorite number is ${t.number??""}.`)),p(r,e)}var $e=w("<p> </p>");function Ze(r,t){var e=$e(),a=v(e);u(e),A(()=>M(a,`I am component B and my name is ${t.name??""}.`)),p(r,e)}var Ye=w('<section id="demo-component"><h2>Dynamic Svelte Component</h2> <!></section>');function Ve(r){const t={A:Qe,B:Ze},e=[{component:"A",number:42},{component:"B",name:"Russell"}];var a=Ye(),o=f(v(a),2);E(o,17,()=>e,U,(s,d)=>{const _=j(()=>t[i(d).component]);var g=T(),c=S(g);ne(c,()=>i(_),(l,n)=>{n(l,ae(()=>i(d)))}),p(s,g)}),u(a),p(r,a)}var Xe=w('<div><p class="svelte-1sxgmm9"> </p></div>'),Ke=w('<section id="scrolly"><h2 class="svelte-1sxgmm9">Scrolly <span> </span></h2> <div class="spacer svelte-1sxgmm9"></div> <!> <div class="spacer svelte-1sxgmm9"></div></section>');function et(r){let t=P(void 0);var e=Ke(),a=v(e),o=f(v(a)),s=v(o,!0);u(o),u(a);var d=f(a,4);qe(d,{get value(){return i(t)},set value(_){H(t,_,!0)},children:(_,g)=>{var c=T(),l=S(c);E(l,16,()=>[0,1,2,3,4],U,(n,h,b)=>{const y=j(()=>i(t)===b);var m=Xe();let x;var k=v(m),C=v(k,!0);u(k),u(m),A(()=>{x=Me(m,1,"step svelte-1sxgmm9",null,x,{active:i(y)}),M(C,h)}),p(n,m)}),p(_,c)},$$slots:{default:!0}}),ke(2),u(e),A(()=>M(s,i(t)||"-")),p(r,e)}const tt=`{
  "hed": "A love story",
  "story": [
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "addclass": "hide",
      "metric_reverse": "true",
      "text": ""
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "metric_reverse": "true",
      "text": "Once upon a time in the 1960s, a boy and a girl met at college. We’ll call them Robert and Linda."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "metric_reverse": "true",
      "text": "A few years later, during an unusually rainy season in January, they started dating."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "metric_reverse": "true",
      "text": "Then a few years after that, they got married."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "kids",
      "metric_reverse": "true",
      "text": "Eventually they had two kids, bought a single-family home, and built successful careers."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "text": "Decades later, in 2017, Robert was asked how his relationship is.\\r\\n\\r\\n\\r\\nHe said it was excellent."
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "metric_reverse": "true",
      "text": "Robert is one of the thousands of adults Stanford University researchers have been [tracking](https://data.stanford.edu/hcmst2017) to understand how couples meet, how they separate, and what their relationships are like.\\r\\n\\r\\n\\r\\nHere, I’ve grouped everyone on the screen by their relationship status in 2017.\\r\\n\\r\\n\\r\\n<div class=smallText>This piece only visualizes people who participated in all three waves of this survey.</div>"
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "For now, most partnered people say their relationships are <span class=pink>excellent</span> or <span class=purple>good</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppgender",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Men are slightly more likely to say their relationship is <span class=pink>excellent</span> .\\r\\n\\r\\n\\r\\n>> People reporting excellent relationships, 2017|Relationship happiness by gender|gender2017|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017"
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppincimp",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "People with more money tend to report <span class=pink>better relationships</span> —partially because they have more time and resources to devote to their partners."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppage",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Also, older people have had more time to find and develop <span class=pink>high-quality relationships</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppage",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "zoom_sprite": "",
      "text": "But over time, fewer and fewer people have said their relationships are excellent—and that aligns with some concerning trends.\\r\\n\\r\\n\\r\\nMore people report being unsatisfied with their marriage.\\r\\n\\r\\n\\r\\n>> People who say their marriage is “very happy”|Marriage satisfaction data from GSS|marriagesatisfaction|General Social Survey|https://gssdataexplorer.norc.org/trends?category=Gender%20%26%20Marriage&measure=hapmar\\r\\n\\r\\n\\r\\nAnd the dynamics in those relationships have shifted in worrying ways.\\r\\n\\r\\n\\r\\nFrom 1987 to 2013, both [married couples](https://pubmed.ncbi.nlm.nih.gov/36683860/) and [cohabitating partners](https://link.springer.com/article/10.1007/s11113-025-09982-y) reported more unfairness and disagreement. They also said they interacted less with their partners, [possibly](https://www.theatlantic.com/health/archive/2017/09/we-expect-way-too-much-from-our-romantic-partners/541353/) because many Americans are working longer hours to make ends meet.\\r\\n\\r\\n\\r\\n>> Relationship dynamics from 1987 to 2013|Slope charts showing relationship declines|dynamics|Wright, Brown, and Manning (2023) and Wright, Zugarek, Brown, and Manning (2025)|https://link.springer.com/article/10.1007/s11113-025-09982-y|The measures for the marriage and cohabiting studies are slightly different, so the vertical axes show the minimum and maximum for each measure.\\r\\n\\r\\n\\r\\nGiven these circumstances, some researchers suspected that a societal disruption like a pandemic could expose the fractures in our relationships—eroding or even breaking them. This is called [stress theory](https://pubmed.ncbi.nlm.nih.gov/7644604/), which argues that these stressors actually use up the very energy we need to support our partners through it. This is especially true of [chronic stressors](https://www.sciencedirect.com/science/article/abs/pii/S2352250X16300690), like financial strain and long-term illness, which constantly sip away at the emotional capacity we need to care for both a relationship and our own well-being.\\r\\n\\r\\n\\r\\nBut if couples can successfully navigate these challenges, researchers have found that it brings couples closer together—a framework called [resilience theory](https://onlinelibrary.wiley.com/doi/10.1111/j.1545-5300.2003.00001.x). They are able to build a shared meaning of the threat, come up with a plan, and rely on each other to weather the events."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "kids",
      "metric_reverse": "true",
      "text": "It’s 2020. A global pandemic begins.\\r\\n\\r\\n\\r\\nWithin the confines of their locked down home, Robert and Linda have agreed that they should socially distance and wear masks in public."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "metric_reverse": "true",
      "text": "They haven’t fought much during lockdown, unlike some couples."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "text": "In fact, Robert says his relationship is still excellent—just like before.\\r\\n\\r\\n\\r\\nNot a huge surprise, given that they’ve been together for more than 50 years!"
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "addclass": "nocolor",
      "metric_reverse": "true",
      "text": "But what happened to everyone else we met in 2017?"
    },
    {
      "chart_title": "What happened to relationships from 2017 to 2020",
      "sort_var": "w1_partnership_status",
      "metric": "w2_relationship_end",
      "metric_reverse": "",
      "text": "From 2017 to several months into the pandemic, many unmarried couples <span class=peach>broke up</span>, but most people stayed together <span class=lavender>stayed together</span>.",
      "null_value": -1,
      "single_sort_values": [
        3,
        4
      ]
    },
    {
      "chart_title": "Partnership status, 2020",
      "sort_var": "w2_partner_type",
      "metric": "",
      "metric_reverse": "true",
      "text": "So here’s the updated partnership status of everyone in 2020."
    },
    {
      "chart_title": "How often couples fought in past week, 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_fight_bucket",
      "metric_reverse": "true",
      "text": "But even among people who stayed together, many said they <span class=purple>fought</span> with their partner <span class=pink>multiple</span> times in the past week."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "text": "In fact, from 2017 to 2020, many people rated their relationship <span class=peach>worse</span> than it was before."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "For thousands of years, marriage was a tool that ensured wealth and property were transferred and consolidated across generations. “It was too vital an economic and political institution to be entered into solely on the basis of something as irrational as love,” writes historian Stephanie Coontz in her book, [Marriage, a History](https://www.penguinrandomhouse.com/books/291184/marriage-a-history-by-stephanie-coontz/). \\r\\n\\r\\n\\r\\nHowever, by the late-1700s, marriage had evolved into more private arrangements between individuals, and love and companionship entered the picture. But this era came with another rigid script: Men and women have innately different natures, so they should occupy different roles. The husband was expected to be the sole breadwinner and to rule his household, sometimes by force. The wife was expected to tend to the home, while serving as the “sentimental core” of the household, Coontz writes.\\r\\n\\r\\n\\r\\nThe script was strict enough that the only socially acceptable way to have sex and raise children was inside a marriage, according to historian [Andrew J. Cherlin](https://www.jstor.org/stable/3600162). So most people got married, and did so at a young age. \\r\\n\\r\\n\\r\\n>> Marriage rates and age|line charts of rates and age|marriagearate|US Census Bureau\\r\\n\\r\\n\\r\\nBut the script gradually unraveled. Sociologists [Francesca Cancian and Steven Gordon](https://journals.sagepub.com/doi/abs/10.1177/089124388002003006) analyzed the marriage advice popular magazines offered across the 20th century, and found a gradual shift away from fixed gender roles and toward advice urging couples to shape their relationships around their own needs and self-fulfillment.\\r\\n\\r\\n>> Modern themes in marriage advice|line chart of rising modern themes|themes|Cancian and Gordon (1988)|https://journals.sagepub.com/doi/abs/10.1177/089124388002003006\\r\\n\\r\\n\\r\\nBeginning in the 1960s, marriage became less about fulfilling societal gender roles, and more about negotiating a partnership that works for us both inside and outside our relationships. We want a partner who can allow us to develop into the person we want to be—and it doesn’t even have to include marriage.\\r\\n\\r\\n\\r\\nSociologist Eli J. Finkel [argues](https://www.nytimes.com/2014/02/15/opinion/sunday/the-all-or-nothing-marriage.html) that our evolving expectations of relationships have followed Maslow’s hierarchy of needs. Initially we chose our relationships based on survival; then we wanted to feel loved; and then we wanted relationships that helped us be the people we want to be.\\r\\n\\r\\n\\r\\n>> Maslow’s hierarchy of needs|pyramid of the hierarchy|maslow|Maslow (1943)|https://psychclassics.yorku.ca/Maslow/motivation.htm\\r\\n\\r\\n\\r\\nThis means we want relationships that provide security, passion, intellectual stimulation, and personal growth. We expect more from our partners than ever before—an “all-or-nothing” arrangement, Finkel [says](https://www.amazon.com/All-Nothing-Marriage-Best-Marriages/dp/052595516X).\\r\\n\\r\\n\\r\\nWhen our relationships can’t meet our high and sometimes rigid expectations, we’re unsatisfied.\\r\\n\\r\\n\\r\\nBut when our relationships live up to these expectations, we’re happier than ever.\\r\\n\\r\\n\\r\\n“Over the past century, marriage has steadily become more fair, more fulfilling, and more effective in fostering the well-being of both adults and children than ever before in history,” Coontz writes. “It has also become more optional and more fragile.”"
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "When asked about the quality of their relationship, the top of the rating scale is <span class=pink>excellent</span>.\\r\\n\\r\\n\\r\\nBut something interesting is under the surface."
    },
    {
      "chart_title": "Relationship quality, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "First, let’s sort these people by their relationship quality.\\r\\n\\r\\n\\r\\nAnd then let’s ask them a question: How did the pandemic change your relationship?"
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "Whoa! Many people in excellent relationships actually said their relationship got even <span class=pink>better</span>."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "Meanwhile, the pandemic was far more likely to <span class=peach>erode</span> the quality of less-than-excellent relationships."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2022",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "And two years later, these effects were even stronger: More excellent relationships got <span class=pink>better</span>, while fair or worse relationships <span class=peach>suffered</span>."
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "text": "And couples in excellent relationships were far more likely to have <span class=pink>complete agreement</span> on what safety measures they should follow during the pandemic.\\r\\n\\r\\n\\r\\nA 63-year-old man [told](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) researchers, “We have given up the outside world to keep each other safe. You see, I love [wife’s name] so much.”"
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "The way couples responded to the pandemic gives us a big hint as to why some of these partnerships are so strong.\\r\\n\\r\\n\\r\\nStanford researchers [found](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) that functional couples engaged in “mutual meaning making.” They aligned their perspectives on the virus’s risk, and agreed on how they would behave in response to it. \\r\\n\\r\\n\\r\\nAnd when they didn’t?\\r\\n\\r\\n\\r\\n“A big wedge has been driven between us on how exactly to handle the virus,” a 22-year-old woman told researchers. “I want to wear a mask, gloves, limit exposure as much as humanly possible, I wipe down surfaces and use hand sanitizer. He thinks I’m being, in his words, ‘ridiculous and paranoid.’ “\\r\\n\\r\\n\\r\\nPsychologist John Gottman, who has observed thousands of couples, says that building a life with a shared sense of meaning and purpose is important. In fact, he puts that at the very top of his “Sound Relationship House”—the components that make up a strong relationship.\\r\\n\\r\\n\\r\\n>> The Sound Relationship House|house with labels|gottman|John Gottman|https://www.gottman.com/blog/the-sound-relationship-house-build-love-maps/\\r\\n\\r\\n\\r\\n“I believe that everyone is a philosopher trying to make some sense out of this brief journey we have through life,” Gottman writes in his book, [The Science of Trust](https://wwnorton.com/books/9780393705959). “People do that in many ways, including creating formal and informal rituals of connection, creating shared  goals and life missions, supporting each other’s basic roles in life, and agreeing on the meaning of central values and symbols (like ‘what is a home?’).”\\r\\n\\r\\n\\r\\nAnd he writes that it all starts from building a “love map” of your partner.\\r\\n\\r\\n\\r\\n”It’s about feeling like your partner is interested in knowing you, and your partner feeling that you are interested in knowing her or him,” he writes."
    },
    {
      "chart_title": "Partnership status, 2022",
      "sort_var": "w3_partner_type",
      "metric": "w3_partner_type",
      "metric_reverse": "true",
      "text": "These days, people often focus on how there are more <span class=neutral>single people</span> now than ever before.\\r\\n\\r\\n\\r\\nAbout a quarter of 40-year-old Americans have never been married, according to a [Pew Research analysis](https://www.pewresearch.org/short-reads/2023/06/28/a-record-high-share-of-40-year-olds-in-the-us-have-never-been-married/)."
    },
    {
      "chart_title": "How relationship quality changed, 2017 to 2022",
      "sort_var": "w3_partner_type",
      "metric": "qual_diff_w1_w3_simple",
      "metric_reverse": "true",
      "text": "They point out that a lot of people report having <span class=peach>worse</span> relationships than before."
    },
    {
      "chart_title": "Met a non-partner for romance in past year, 2022",
      "sort_var": "w3_partner_type",
      "metric": "w3_otherdate",
      "metric_reverse": "true",
      "text": "Furthermore, single people are [less interested](https://www.rasmussenreports.com/public_content/lifestyle/general_lifestyle/june_2025/dating_37_of_young_singles_aren_t_interested) in <span class=pink>pursuing romance</span> than in prior generations."
    },
    {
      "chart_title": "Relationship duration as of 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "",
      "metric_reverse": "false",
      "icon_reverse": "true",
      "text": "If we first group these people by how long they’ve been in a relationship…"
    },
    {
      "chart_title": "Met partner online as of 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_Q32_simple",
      "metric_reverse": "false",
      "icon_reverse": "true",
      "text": "… we can see that <span class=pink>online dating</span> is how most new relationships start these days. And people [really don’t enjoy](https://www.theatlantic.com/technology/archive/2024/04/dating-apps-are-starting-crack/678022/) online dating.",
      "null_value": -1,
      "keep_null_sort": true
    },
    {
      "chart_title": "Met partner online, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_Q32_simple",
      "metric_reverse": "true",
      "icon_reverse": "true",
      "zoom_sprite": "",
      "addclass": "longcopy",
      "text": "The world doesn’t look the way it does in our love stories. So it’s tempting to believe that we just need to go back to those scripts.\\r\\n\\r\\n\\r\\nA [recent survey](https://www.kcl.ac.uk/news/almost-a-third-of-gen-z-men-agree-a-wife-should-obey-her-husband) found that Gen Z men worldwide are more likely to have traditional views on relationships than the last three generations. \\r\\n\\r\\n\\r\\nEven though dating has moved online, about [90%](https://phys.org/news/2022-02-discrepancy-hookup-culture-sexual-dates.html) of dates among young people are still initiated by men.\\r\\n\\r\\n\\r\\nAnd in heterosexual relationships, women still do [more household work](https://fraser.stlouisfed.org/files/docs/releases/atus/atus_20250626.pdf) than men. This doesn’t even include the [mental labor](https://journals.sagepub.com/doi/10.1177/0003122419859007) women do to keep a household functioning.\\r\\n\\r\\n\\r\\nBut when we default back to these traditional love stories, we end up being characters in our own lives—and we end up treating our partners that way, too. It’s a story that expects women to be submissive and deferential to men, while being responsible for most of the domestic work. It expects men to play the role of provider and protector, even when their families need them to be nurturers and caretakers.\\r\\n\\r\\n\\r\\nThis story doesn’t require us to build love maps of each other. Instead it tells us all we have to do is follow the script.",
      "null_value": -1,
      "keep_null_sort": true
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "metric_reverse": "true",
      "text": "But I’d prefer to live in a story that works for me and the person I love most in this world—a story that takes place on our overlapping love maps."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "metric_reverse": "true",
      "text": "Because we aren’t characters in a story.\\r\\n\\r\\n\\r\\nWe are two people who want to spend the rest of our lives together, and that’s better than a story."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "metric_reverse": "true",
      "addclass": "explore",
      "text": "**Explore the data**"
    }
  ],
  "methods": "<h6>Data</h6>\\r\\nRosenfeld, Michael J., Reuben J. Thomas, and Sonia Hausen. 2023. How Couples Meet and Stay Together 2017-2020-2022 combined dataset. [Computer files]. Stanford, CA: Stanford University Libraries. https://data.stanford.edu/hcmst2017",
  "colors": {}
}`;var rt=w("<p></p>"),nt=w('<details><summary></summary> <div class="content"><!></div></details>');function at(r,t){let e=j(()=>typeof t.content=="string"),a=j(()=>t.open==="true");var o=nt(),s=v(o);W(s,()=>t.summary,!0),u(s);var d=f(s,2),_=v(d);{var g=l=>{var n=T(),h=S(n);W(h,()=>t.content),p(l,n)},c=l=>{var n=T(),h=S(n);E(h,17,()=>t.content,U,(b,y)=>{let m=()=>i(y).value;var x=rt();W(x,m,!0),u(x),p(b,x)}),p(l,n)};Y(_,l=>{i(e)?l(g):l(c,-1)})}u(d),u(o),A(()=>{o.open=i(a),de(o,"name",t.name)}),p(r,o)}var ot=w("<li></li>"),st=w("<ul></ul>");function it(r,t){var e=st();E(e,21,()=>t.li,U,(a,o)=>{var s=ot();W(s,()=>i(o),!0),u(s),p(a,s)}),u(e),p(r,e)}var lt=w("<li></li>"),ct=w("<ol></ol>");function ht(r,t){var e=ct();E(e,21,()=>t.li,U,(a,o)=>{var s=lt();W(s,()=>i(o),!0),u(s),p(a,s)}),u(e),p(r,e)}var pt=w("<p></p>"),ut=w("<section><!></section>");function dt(r,t){V(t,!0);const e={details:at,ul:it,ol:ht};let a=Q(t,"components",19,()=>({})),o=Q(t,"body",19,()=>[]);var s=T(),d=S(s);E(d,17,o,U,(_,g)=>{let c=()=>i(g).section,l=()=>i(g).content;const n=j(()=>c().toLowerCase().replace(/[^a-z0-9]/g,"")),h=j(()=>a()[c()]);var b=ut(),y=v(b);{var m=k=>{var C=T(),q=S(C);ne(q,()=>i(h),(F,B)=>{B(F,ae(l))}),p(k,C)},x=k=>{var C=T(),q=S(C);E(q,17,l,U,(F,B,J,L)=>{let D=()=>i(B).type,O=()=>i(B).value;const se=j(()=>a()[D()]||e[D()]),ve=j(()=>typeof O()=="string");var ie=T(),_e=S(ie);{var fe=I=>{var R=T(),G=S(R);ne(G,()=>i(se),($,Z)=>{Z($,ae(O))}),p(I,R)},ge=I=>{var R=pt();W(R,O,!0),u(R),p(I,R)},we=I=>{var R=T(),G=S(R);re(G,D,!1,($,Z)=>{var le=T(),be=S(le);W(be,O),p(Z,le)}),p(I,R)},ye=I=>{var R=T(),G=S(R);re(G,D,!1,($,Z)=>{Te($,()=>({...O()}))}),p(I,R)};Y(_e,I=>{i(se)?I(fe):D()==="text"?I(ge,1):i(ve)?I(we,2):I(ye,-1)})}p(F,ie)}),p(k,C)};Y(y,k=>{i(h)?k(m):k(x,-1)})}u(b),A(()=>de(b,"id",i(n))),p(_,b)}),p(r,s),X()}var mt=w('<p> </p> <progress max="100"></progress>',1);function vt(r,t){let e=Q(t,"label",3,"A"),a=Q(t,"value",3,0);var o=mt(),s=S(o),d=v(s,!0);u(s);var _=f(s,2);A(()=>{M(d,e()),Ae(_,a())}),p(r,o)}var _t=w('<section id="cms"><h2>MicroCMS</h2> <code><pre> </pre></code> <!></section>');function ft(r,t){V(t,!0);const{body:e}=Ie,a={Test:vt};var o=_t(),s=f(v(o),2),d=v(s),_=v(d,!0);u(d),u(s);var g=f(s,2);dt(g,{get components(){return a},get body(){return e}}),u(o),A(c=>M(_,c),[()=>tt.replace(/\t/g," ")]),p(r,o),X()}const gt=(r,t=ue)=>{var e=wt(),a=v(e),o=v(a,!0);u(a);var s=f(a,2),d=v(s,!0);u(s),u(e),A(()=>{M(o,t().name),M(d,t().age)}),p(r,e)};var wt=w('<div class="person svelte-q3gttf"><p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p></div>'),yt=w('<h2>Svelte5</h2> <h3>Reactive variables 3 ways:</h3> <button class="svelte-q3gttf">count++</button> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <h3>Children (previously slots):</h3> <div class="children"><!></div> <h3>Dispatch Event</h3> <button class="svelte-q3gttf">Random</button>  <h3>Snippets</h3> <div class="people svelte-q3gttf"></div>',1);function bt(r,t){V(t,!0),Q(t,"age",3,30);const e=[{name:"John",age:30},{name:"Jill",age:45}];let a=P(0),o=j(()=>i(a)*2),s=j(()=>i(a)*2),d=P(0);oe(()=>{H(d,i(a)*2)});var _=yt(),g=f(S(_),4),c=f(g,2),l=v(c);u(c);var n=f(c,2),h=v(n);u(n);var b=f(n,2),y=v(b);u(b);var m=f(b,4),x=v(m);Re(x,()=>t.children??ue),u(m);var k=f(m,4),C=f(k,4);E(C,21,()=>e,U,(q,F)=>{gt(q,()=>i(F))}),u(C),A(()=>{M(l,`${i(a)??""} doubled is ${i(o)??""} (derived)`),M(h,`${i(a)??""} doubled is ${i(s)??""} (derived by)`),M(y,`${i(a)??""} doubled is ${i(d)??""} ($effect)`)}),ce("click",g,()=>xe(a)),ce("click",k,()=>t.random(Math.floor(Math.random()*10))),p(r,_),X()}ze(["click"]);const kt=(r,t)=>{let e=P(Se(r)),a=P(null),o=P(!0),s=P(void 0);const d=(c=!0)=>{H(o,c,!0),c===!0&&(H(s,null),H(a,null))},_=async()=>{try{const c=await fetch(i(e),t);if(!c.ok)throw new Error(`Unexpected error occurred (status ${c.status})`);let l;if(i(e).includes(".csv")){const n=await c.text();l=Fe(n)}else l=await c.json();return[null,l]}catch(c){const{errorMessage:l="Unexpected error eccurred"}=c;return[l,null]}},g=async c=>{d(!0);const[l,n]=await _();if(c===i(e)){if(l){d(!1),H(s,l,!0);return}d(!1),H(a,n,!0)}};return oe(()=>{g(i(e))}),{get data(){return i(a)},get loading(){return i(o)},get error(){return i(s)},get url(){return i(e)},set url(c){i(e)!==c&&H(e,c,!0)}}};var xt=w("<p>loading data...</p>"),St=w("<p> </p>"),Ct=w("<p>data loaded</p> <pre> </pre>",1),zt=w('<div class="c"><h2>Load Data</h2> <div class="response"><!></div></div>');function Mt(r,t){V(t,!0);const e=`${De}/assets/demo/test.csv`,a=kt(e);oe(()=>{});var o=zt(),s=f(v(o),2),d=v(s);{var _=l=>{var n=xt();p(l,n)},g=l=>{var n=St(),h=v(n);u(n),A(()=>M(h,`error: ${a.error??""}`)),p(l,n)},c=l=>{var n=Ct(),h=f(S(n),2),b=v(h,!0);u(h),A(y=>M(b,y),[()=>JSON.stringify(a.data,null,2)]),p(l,n)};Y(d,l=>{a.loading?l(_):a.error?l(g,1):l(c,-1)})}u(s),u(o),p(r,o),X()}var Tt=w('<div id="demo" class="svelte-15aotx7"><h1>Demo</h1> <!> <!> <!> <!> <!> <!> <!> <!></div>');function At(r){let t=P(0);function e(h){console.log(h)}var a=Tt(),o=f(v(a),2);We(o);var s=f(o,2);Le(s);var d=f(s,2);Ge(d);var _=f(d,2);Ve(_);var g=f(_,2);ft(g,{});var c=f(g,2);Mt(c,{});var l=f(c,2);et(l);var n=f(l,2);bt(n,{random:e,get value(){return i(t)},set value(h){H(t,h,!0)}}),u(a),p(r,a)}function Ot(r){At(r)}export{Ot as component};
