import { Link } from "wouter";
import { ArrowLeft, FileText, DollarSign, Shield, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoachTerms() {
  const lastUpdated = "29 janvier 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/coach/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour au tableau de bord
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-slate-800 dark:text-white">Termes et Conditions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Termes et Conditions pour les Coachs</h1>
            <p className="text-teal-100">RusingÂcademy - Plateforme de Coaching Linguistique</p>
            <p className="text-sm text-teal-200 mt-4">Dernière mise à jour : {lastUpdated}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                1. Introduction
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Les présentes conditions générales (« Conditions ») régissent votre utilisation de la plateforme 
                RusingÂcademy en tant que coach certifié. En acceptant ces conditions, vous reconnaissez avoir 
                lu, compris et accepté l'ensemble des termes ci-dessous. Ces conditions constituent un accord 
                juridiquement contraignant entre vous (« Coach ») et RusingÂcademy Inc. (« la Plateforme »).
              </p>
            </section>

            {/* Commission Structure - HIGHLIGHTED */}
            <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                2. Structure de Commission
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-300 dark:border-amber-600">
                  <p className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Commission de la Plateforme : <span className="text-amber-600 text-2xl">30%</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Pour chaque paiement reçu via la plateforme RusingÂcademy, une commission de <strong>trente pour cent (30%)</strong> 
                    sera automatiquement prélevée par la plateforme. Le coach recevra les <strong>soixante-dix pour cent (70%)</strong> restants 
                    directement sur son compte Stripe Connect.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Exemple de calcul</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Session à 100$ CAD</li>
                      <li>• Commission plateforme : 30$ (30%)</li>
                      <li>• Revenu coach : 70$ (70%)</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Ce que couvre la commission</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Acquisition de clients</li>
                      <li>• Infrastructure technologique</li>
                      <li>• Support client</li>
                      <li>• Marketing et visibilité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                3. Modalités de Paiement
              </h2>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>3.1 Compte Stripe Connect :</strong> Chaque coach doit créer et maintenir un compte Stripe Connect 
                  valide pour recevoir ses paiements. La plateforme n'est pas responsable des retards causés par des 
                  informations bancaires incorrectes ou incomplètes.
                </p>
                <p>
                  <strong>3.2 Délai de versement :</strong> Les paiements sont versés automatiquement sur votre compte 
                  bancaire selon le calendrier de Stripe (généralement 2-7 jours ouvrables après la transaction).
                </p>
                <p>
                  <strong>3.3 Devise :</strong> Tous les paiements sont effectués en dollars canadiens (CAD), sauf 
                  indication contraire convenue par écrit.
                </p>
                <p>
                  <strong>3.4 Taxes :</strong> Le coach est seul responsable de la déclaration et du paiement de 
                  toutes les taxes applicables sur ses revenus de coaching.
                </p>
              </div>
            </section>

            {/* Obligations */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                4. Obligations du Coach
              </h2>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>4.1 Qualité de service :</strong> Le coach s'engage à fournir des services de coaching 
                  de haute qualité, conformes aux standards professionnels de l'industrie.
                </p>
                <p>
                  <strong>4.2 Disponibilité :</strong> Le coach doit maintenir son calendrier de disponibilité à jour 
                  et honorer toutes les sessions réservées, sauf cas de force majeure.
                </p>
                <p>
                  <strong>4.3 Confidentialité :</strong> Le coach s'engage à maintenir la confidentialité des 
                  informations personnelles des apprenants et à ne pas les utiliser à des fins non autorisées.
                </p>
                <p>
                  <strong>4.4 Professionnalisme :</strong> Le coach doit maintenir une conduite professionnelle 
                  en tout temps et représenter positivement la plateforme RusingÂcademy.
                </p>
                <p>
                  <strong>4.5 Exclusivité des paiements :</strong> Tous les paiements pour les sessions organisées 
                  via la plateforme doivent transiter par le système de paiement de RusingÂcademy. Il est strictement 
                  interdit de solliciter des paiements directs des apprenants rencontrés via la plateforme.
                </p>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
                5. Politique d'Annulation
              </h2>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>5.1 Annulation par le coach :</strong> En cas d'annulation par le coach moins de 24 heures 
                  avant la session, l'apprenant sera intégralement remboursé et le coach pourra faire l'objet de 
                  pénalités.
                </p>
                <p>
                  <strong>5.2 Annulation par l'apprenant :</strong> Les annulations par l'apprenant sont soumises 
                  à la politique d'annulation de la plateforme. Le coach recevra sa part (70%) si l'annulation 
                  intervient moins de 24 heures avant la session.
                </p>
                <p>
                  <strong>5.3 No-show :</strong> En cas d'absence non justifiée de l'apprenant, le coach recevra 
                  l'intégralité de sa part (70%) de la session.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                6. Résiliation
              </h2>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>6.1 Résiliation volontaire :</strong> Le coach peut mettre fin à son partenariat avec 
                  RusingÂcademy à tout moment avec un préavis de 30 jours. Toutes les sessions réservées pendant 
                  cette période doivent être honorées.
                </p>
                <p>
                  <strong>6.2 Résiliation pour cause :</strong> RusingÂcademy se réserve le droit de résilier 
                  immédiatement le partenariat en cas de violation des présentes conditions, de comportement 
                  inapproprié, ou de plaintes répétées des apprenants.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                7. Propriété Intellectuelle
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Le coach conserve tous les droits sur son contenu original. Cependant, en utilisant la plateforme, 
                le coach accorde à RusingÂcademy une licence non exclusive pour utiliser son nom, sa photo et 
                sa biographie à des fins de marketing et de promotion de la plateforme.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                8. Modifications des Conditions
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                RusingÂcademy se réserve le droit de modifier ces conditions à tout moment. Les coachs seront 
                notifiés de tout changement significatif par courriel au moins 30 jours avant l'entrée en vigueur 
                des nouvelles conditions. L'utilisation continue de la plateforme après cette période constitue 
                une acceptation des nouvelles conditions.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                9. Contact
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Pour toute question concernant ces conditions, veuillez contacter notre équipe à :{" "}
                <a href="mailto:coaches@rusingacademy.ca" className="text-teal-600 hover:underline">
                  coaches@rusingacademy.ca
                </a>
              </p>
            </section>

            {/* Acceptance Summary */}
            <section className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                Résumé des Points Clés
              </h2>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Commission de <strong>30%</strong> prélevée sur chaque paiement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Vous recevez <strong>70%</strong> de chaque session directement sur votre compte Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Paiements automatiques via Stripe Connect (2-7 jours ouvrables)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Vous êtes responsable de vos obligations fiscales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Tous les paiements doivent passer par la plateforme</span>
                </li>
              </ul>
            </section>

            {/* Back Button */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link href="/coach/dashboard">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Retour au Tableau de Bord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
