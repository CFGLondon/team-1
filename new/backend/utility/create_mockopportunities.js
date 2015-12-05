var Opportunity = require("../models/opportunity");

module.exports = function (amount) {
    for (i=0; i<amount; i++)
    {

        // SELECTIVE OPTIONS
        var divisions = ["it","biology","sports","bank"];
        var types = ["part-time", "full-time"];
        var locations = ["London", "UK", "Manchester", "Glasgow", "Edinburgh", "Woking", "Addlestone"];
        var companyIDS = ["566264fd12ff39e018eb85e7","566277ceb3ba1c78196c6bb6","56628cf73d5d854028cfcd9a","56628cf63d5d854028cfcd95","56628cf53d5d854028cfcd93","56628cf53d5d854028cfcd92","56628cf53d5d854028cfcd91"]

        // VALUE ASSIGNMENT
        var companyId = randomise(companyIDS);
        var description = generateDescription();
        var type = randomise(types);
        var division = randomise(divisions);
        var location = randomise(locations);

        var opportunity = new Opportunity({
            companyId:companyId,
            description:description,
            type:type,
            division:division,
            location:location
        });
        opportunity.save();
    }
};

function randomise(selection)
{
    //selects item at random from given list
    return selection[rrandom(selection.length-1)];
}

function rrandom(number)
{
    //returns round(random(number)) >> integer value between 0 and input value
    return Math.round(Math.random()*number);
}

function generateEmail(name, suffix)
{
    return uncapitalize(name)+rrandom(9999).toString()+"@"+suffix+".com";
}

function generateName()
{
    opt_names = ["smith","johnson","williams","jones","brown","davis","miller","wilson","moore","taylor","anderson",
        "thomas","jackson","white","harris","martin","thompson","garcia","martinez","robinson","clark","rodriguez",
        "lewis","lee","walker","hall","allen","young","hernandez","king","wright","lopez","hill","scott","green",
        "adams","baker","gonzalez","nelson","carter","mitchell","perez","roberts","turner","phillips","campbell",
        "parker","evans","edwards","collins","stewart","sanchez","morris","rogers","reed","cook","morgan","bell",
        "murphy","bailey","rivera","cooper","richardson","cox","howard","ward","torres","peterson","gray","ramirez",
        "james","watson","brooks","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman",
        "jenkins","perry","powell","long","patterson","hughes","flores","washington","butler","simmons","foster",
        "gonzales","bryant","alexander","russell","griffin","diaz","hayes","myers","ford","hamilton","graham",
        "sullivan","wallace","woods","cole","west","jordan","owens","reynolds","fisher","ellis","harrison","gibson",
        "mcdonald","cruz","marshall","ortiz","gomez","murray","freeman","wells","webb","simpson","stevens","tucker",
        "porter","hunter","hicks","crawford","henry","boyd","mason","morales","kennedy","warren","dixon","ramos",
        "reyes","burns","gordon","shaw","holmes","rice","robertson","hunt","black","daniels","palmer","mills",
        "nichols","grant","knight","ferguson","rose","stone","hawkins","dunn","perkins","hudson","spencer","gardner",
        "stephens","payne","pierce","berry","matthews","arnold","wagner","willis","ray","watkins","olson","carroll",
        "duncan","snyder","hart","cunningham","bradley","lane","andrews","ruiz","harper","fox","riley","armstrong",
        "carpenter","weaver","greene","lawrence","elliott","chavez","sims","austin","peters","kelley","franklin",
        "lawson","fields","gutierrez","ryan","schmidt","carr","vasquez","castillo","wheeler","chapman","oliver",
        "montgomery","richards","williamson","johnston","banks","meyer","bishop","mccoy","howell","alvarez",
        "morrison","hansen","fernandez","garza","harvey","little","burton","stanley","nguyen","george","jacobs",
        "reid","kim","fuller","lynch","dean","gilbert","garrett","romero","welch","larson","frazier","burke",
        "hanson","day","mendoza","moreno","bowman","medina","fowler","brewer","hoffman","carlson","silva","pearson",
        "holland","douglas","fleming","jensen","vargas","byrd","davidson","hopkins","may","terry","herrera","wade",
        "soto","walters","curtis","neal","caldwell","lowe","jennings","barnett","graves","jimenez","horton","shelton",
        "barrett","obrien","castro","sutton","gregory","mckinney","lucas","miles","craig","rodriquez","chambers",
        "holt","lambert","fletcher","watts","bates","hale","rhodes","pena","beck","newman"];
    return capitalize(randomise(opt_names));
}

function capitalize(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1));
}

function generateDescription(name, type)
{
    return "In order to begin training with the NHS scientist training programme (STP) you will need a 2.1 or higher BSc in a relevant discipline. Further research experience or qualifications are also desirable. The application process for the STP typically starts in January.     In order to practice as a clinical scientist in the UK you must be registered with the Health Professions Council (HPC). You will automatically be eligible for registration if you have completed an HPC approved course, but you will need to pay a fee.";
}

function uncapitalize(str) {
    return (str.charAt(0).toLowerCase() + str.slice(1));
}
